using Atrium.Domain.PromptTemplates;

namespace Atrium.Application.Features.PromptTemplates;

public static class PromptTemplateMappingExtensions
{
    public static PromptTemplateDto ToDto(this PromptTemplate template) =>
        new(
            template.Id,
            template.Name,
            template.Mode,
            template.Body,
            template.IsBuiltIn,
            template.CreatedOnUtc,
            template.ModifiedOnUtc);
}
