using Atrium.Domain.Documents;
using Atrium.Domain.PromptTemplates;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Abstractions;

public interface IAtriumDbContext
{
    DbSet<Document> Documents { get; }

    DbSet<PromptTemplate> PromptTemplates { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
