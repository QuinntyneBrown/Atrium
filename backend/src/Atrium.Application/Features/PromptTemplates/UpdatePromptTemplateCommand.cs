using Atrium.Domain.PromptTemplates;
using MediatR;

namespace Atrium.Application.Features.PromptTemplates;

public sealed record UpdatePromptTemplateCommand(Guid Id, string Name, PromptMode Mode, string Body)
    : IRequest<PromptTemplateDto>;
