using Atrium.Application.Abstractions;
using Atrium.Domain.Documents;
using MediatR;

namespace Atrium.Application.Features.Documents;

public sealed class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, DocumentDto>
{
    private readonly IAtriumDbContext _db;
    private readonly IClock _clock;

    public CreateDocumentCommandHandler(IAtriumDbContext db, IClock clock)
    {
        _db = db;
        _clock = clock;
    }

    public async Task<DocumentDto> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        var now = _clock.UtcNow;
        var document = new Document
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Type = request.Type,
            Content = request.Content,
            Tags = request.Tags?.ToList() ?? new List<string>(),
            CreatedOnUtc = now,
            ModifiedOnUtc = now
        };

        _db.Documents.Add(document);
        await _db.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
