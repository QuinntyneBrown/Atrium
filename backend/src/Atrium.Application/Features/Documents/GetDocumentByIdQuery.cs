using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed record GetDocumentByIdQuery(Guid Id) : IRequest<DocumentDto?>;
