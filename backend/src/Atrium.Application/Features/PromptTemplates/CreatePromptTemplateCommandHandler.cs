using Atrium.Application.Abstractions;
using Atrium.Domain.PromptTemplates;
using MediatR;

namespace Atrium.Application.Features.PromptTemplates;

public sealed class CreatePromptTemplateCommandHandler
    : IRequestHandler<CreatePromptTemplateCommand, PromptTemplateDto>
{
    private readonly IAtriumDbContext _db;
    private readonly IClock _clock;

    public CreatePromptTemplateCommandHandler(IAtriumDbContext db, IClock clock)
    {
        _db = db;
        _clock = clock;
    }

    public async Task<PromptTemplateDto> Handle(
        CreatePromptTemplateCommand request, CancellationToken cancellationToken)
    {
        var now = _clock.UtcNow;
        var template = new PromptTemplate
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Mode = request.Mode,
            Body = request.Body,
            IsBuiltIn = false,
            CreatedOnUtc = now,
            ModifiedOnUtc = now
        };

        _db.PromptTemplates.Add(template);
        await _db.SaveChangesAsync(cancellationToken);

        return template.ToDto();
    }
}
