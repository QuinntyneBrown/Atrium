using Atrium.Application.Abstractions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.Documents;

public sealed class GetDocumentsQueryHandler : IRequestHandler<GetDocumentsQuery, IReadOnlyList<DocumentDto>>
{
    private readonly IAtriumDbContext _db;

    public GetDocumentsQueryHandler(IAtriumDbContext db) => _db = db;

    public async Task<IReadOnlyList<DocumentDto>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Documents.AsNoTracking();

        if (request.Type is { } type)
        {
            query = query.Where(d => d.Type == type);
        }

        var documents = await query.ToListAsync(cancellationToken);

        // SQLite cannot ORDER BY a DateTimeOffset, so order once materialised.
        return documents
            .OrderByDescending(d => d.ModifiedOnUtc)
            .Select(d => d.ToDto())
            .ToList();
    }
}
