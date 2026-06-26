using Atrium.Domain.Documents;
using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed record CreateDocumentCommand(
    string Name,
    DocumentType Type,
    string Content,
    List<string> Tags) : IRequest<DocumentDto>;
