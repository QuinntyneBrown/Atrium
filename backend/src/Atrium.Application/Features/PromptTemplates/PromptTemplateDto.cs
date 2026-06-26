using Atrium.Domain.PromptTemplates;

namespace Atrium.Application.Features.PromptTemplates;

public sealed record PromptTemplateDto(
    Guid Id,
    string Name,
    PromptMode Mode,
    string Body,
    bool IsBuiltIn,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset ModifiedOnUtc);
