using Atrium.Domain.Documents;
using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed record GetDocumentsQuery(DocumentType? Type = null) : IRequest<IReadOnlyList<DocumentDto>>;
