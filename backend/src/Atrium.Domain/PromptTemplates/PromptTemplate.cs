namespace Atrium.Domain.PromptTemplates;

public class PromptTemplate
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public PromptMode Mode { get; set; }

    /// <summary>Template body; may contain <c>{{placeholders}}</c> filled by the prompt builder.</summary>
    public string Body { get; set; } = string.Empty;

    /// <summary>Seeded CHECK/CORRECT/AUTHOR templates are built-in and cannot be edited or deleted.</summary>
    public bool IsBuiltIn { get; set; }

    public DateTimeOffset CreatedOnUtc { get; set; }

    public DateTimeOffset ModifiedOnUtc { get; set; }
}
