using Atrium.Domain.PromptTemplates;
using MediatR;

namespace Atrium.Application.Features.PromptTemplates;

public sealed record CreatePromptTemplateCommand(string Name, PromptMode Mode, string Body)
    : IRequest<PromptTemplateDto>;
