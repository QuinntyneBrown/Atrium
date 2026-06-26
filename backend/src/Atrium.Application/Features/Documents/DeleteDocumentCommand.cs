using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed record DeleteDocumentCommand(Guid Id) : IRequest;
