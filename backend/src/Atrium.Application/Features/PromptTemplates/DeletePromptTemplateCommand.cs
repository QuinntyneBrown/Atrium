using MediatR;

namespace Atrium.Application.Features.PromptTemplates;

public sealed record DeletePromptTemplateCommand(Guid Id) : IRequest;
