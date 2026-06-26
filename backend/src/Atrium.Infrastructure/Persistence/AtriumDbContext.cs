using System.Reflection;
using Atrium.Application.Abstractions;
using Atrium.Domain.Documents;
using Atrium.Domain.PromptTemplates;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Infrastructure.Persistence;

public class AtriumDbContext : DbContext, IAtriumDbContext
{
    public AtriumDbContext(DbContextOptions<AtriumDbContext> options) : base(options)
    {
    }

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<PromptTemplate> PromptTemplates => Set<PromptTemplate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
