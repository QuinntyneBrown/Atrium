using Atrium.Domain.PromptTemplates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Atrium.Infrastructure.Persistence.Configurations;

public sealed class PromptTemplateConfiguration : IEntityTypeConfiguration<PromptTemplate>
{
    public void Configure(EntityTypeBuilder<PromptTemplate> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(t => t.Mode)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(t => t.Body)
            .IsRequired();
    }
}
