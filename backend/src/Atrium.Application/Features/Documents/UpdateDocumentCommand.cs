using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed record UpdateDocumentCommand(
    Guid Id,
    string Name,
    string Content,
    List<string> Tags) : IRequest<DocumentDto>;
