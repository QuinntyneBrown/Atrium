using MediatR;

namespace Atrium.Application.Features.PromptTemplates;

public sealed record GetPromptTemplatesQuery : IRequest<IReadOnlyList<PromptTemplateDto>>;
