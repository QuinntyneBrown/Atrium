using System.Reflection;
using Atrium.Domain.Documents;
using Atrium.Domain.PromptTemplates;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Infrastructure.Persistence;

/// <summary>
/// Seeds default content on startup (idempotent, runs after migrations):
/// the built-in CHECK / CORRECT / AUTHOR prompt templates (the three operating modes of the
/// ISO/IEC/IEEE 42010:2022 context pack), and the context-pack.md document itself as a default
/// attachable resource.
/// </summary>
public static class DataSeeder
{
    private static readonly Guid ContextPackId = Guid.Parse("44444444-4444-4444-4444-444444444444");

    public static async Task SeedAsync(AtriumDbContext db, CancellationToken cancellationToken = default)
    {
        await SeedBuiltInTemplatesAsync(db, cancellationToken);
        await SeedContextPackAsync(db, cancellationToken);
    }

    private static async Task SeedBuiltInTemplatesAsync(AtriumDbContext db, CancellationToken cancellationToken)
    {
        if (await db.PromptTemplates.AnyAsync(t => t.IsBuiltIn, cancellationToken))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        db.PromptTemplates.AddRange(BuiltInTemplates(now));
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedContextPackAsync(AtriumDbContext db, CancellationToken cancellationToken)
    {
        if (await db.Documents.AnyAsync(d => d.Id == ContextPackId, cancellationToken))
        {
            return;
        }

        var content = ReadEmbeddedResource("Resources.context-pack.md");
        if (content is null)
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        db.Documents.Add(new Document
        {
            Id = ContextPackId,
            Name = "context-pack.md",
            Type = DocumentType.Markdown,
            Content = content,
            Tags = new List<string> { "context-pack", "42010", "default" },
            CreatedOnUtc = now,
            ModifiedOnUtc = now
        });
        await db.SaveChangesAsync(cancellationToken);
    }

    private static string? ReadEmbeddedResource(string suffix)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var name = assembly.GetManifestResourceNames()
            .FirstOrDefault(n => n.EndsWith(suffix, StringComparison.OrdinalIgnoreCase));
        if (name is null)
        {
            return null;
        }

        using var stream = assembly.GetManifestResourceStream(name);
        if (stream is null)
        {
            return null;
        }

        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    private static IEnumerable<PromptTemplate> BuiltInTemplates(DateTimeOffset now) =>
    [
        new PromptTemplate
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "CHECK",
            Mode = PromptMode.Check,
            IsBuiltIn = true,
            CreatedOnUtc = now,
            ModifiedOnUtc = now,
            Body =
                "Operate in CHECK mode per the ISO/IEC/IEEE 42010:2022 architecture-description style guide. " +
                "Report problems in the text below without rewriting it. Output a findings list using the format " +
                "`<rule> [error|warning|info] <location> — \"<offending text>\" — <fix>`, then a verdict " +
                "(`clean` or `needs fixes (N)`).\n\n{{document}}"
        },
        new PromptTemplate
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "CORRECT",
            Mode = PromptMode.Correct,
            IsBuiltIn = true,
            CreatedOnUtc = now,
            ModifiedOnUtc = now,
            Body =
                "Operate in CORRECT mode per the ISO/IEC/IEEE 42010:2022 architecture-description style guide. " +
                "Rewrite the text below so it conforms to the house style (third-person impersonal; use only " +
                "shall/should/may for obligation), then list the changes you made.\n\n{{document}}"
        },
        new PromptTemplate
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "AUTHOR",
            Mode = PromptMode.Author,
            IsBuiltIn = true,
            CreatedOnUtc = now,
            ModifiedOnUtc = now,
            Body =
                "Operate in AUTHOR mode per the ISO/IEC/IEEE 42010:2022 architecture-description style guide. " +
                "Using the facts provided below, write new architecture-description text in the house voice " +
                "(third-person impersonal; present tense for current state, future for requirements).\n\n{{document}}"
        }
    ];
}
