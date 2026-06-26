using Atrium.Application.Abstractions;
using Atrium.Application.Common.Exceptions;
using Atrium.Domain.PromptTemplates;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.PromptTemplates;

public sealed class UpdatePromptTemplateCommandHandler
    : IRequestHandler<UpdatePromptTemplateCommand, PromptTemplateDto>
{
    private readonly IAtriumDbContext _db;
    private readonly IClock _clock;

    public UpdatePromptTemplateCommandHandler(IAtriumDbContext db, IClock clock)
    {
        _db = db;
        _clock = clock;
    }

    public async Task<PromptTemplateDto> Handle(
        UpdatePromptTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _db.PromptTemplates
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PromptTemplate), request.Id);

        if (template.IsBuiltIn)
        {
            throw new ValidationException("Built-in prompt templates cannot be modified.");
        }

        template.Name = request.Name;
        template.Mode = request.Mode;
        template.Body = request.Body;
        template.ModifiedOnUtc = _clock.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return template.ToDto();
    }
}
