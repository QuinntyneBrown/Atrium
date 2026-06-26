using Atrium.Application.Abstractions;
using Atrium.Application.Common.Exceptions;
using Atrium.Domain.Documents;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.Documents;

public sealed class UpdateDocumentCommandHandler : IRequestHandler<UpdateDocumentCommand, DocumentDto>
{
    private readonly IAtriumDbContext _db;
    private readonly IClock _clock;

    public UpdateDocumentCommandHandler(IAtriumDbContext db, IClock clock)
    {
        _db = db;
        _clock = clock;
    }

    public async Task<DocumentDto> Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _db.Documents
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Document), request.Id);

        document.Name = request.Name;
        document.Content = request.Content;
        document.Tags = request.Tags?.ToList() ?? new List<string>();
        document.ModifiedOnUtc = _clock.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
