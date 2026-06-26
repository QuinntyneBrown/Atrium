using Atrium.Application.Abstractions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.Documents;

public sealed class GetDocumentByIdQueryHandler : IRequestHandler<GetDocumentByIdQuery, DocumentDto?>
{
    private readonly IAtriumDbContext _db;

    public GetDocumentByIdQueryHandler(IAtriumDbContext db) => _db = db;

    public async Task<DocumentDto?> Handle(GetDocumentByIdQuery request, CancellationToken cancellationToken)
    {
        var document = await _db.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        return document?.ToDto();
    }
}
