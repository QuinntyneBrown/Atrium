using Atrium.Application.Abstractions;
using Atrium.Application.Common.Exceptions;
using Atrium.Domain.Documents;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.Documents;

public sealed class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand>
{
    private readonly IAtriumDbContext _db;

    public DeleteDocumentCommandHandler(IAtriumDbContext db) => _db = db;

    public async Task Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _db.Documents
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Document), request.Id);

        _db.Documents.Remove(document);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
