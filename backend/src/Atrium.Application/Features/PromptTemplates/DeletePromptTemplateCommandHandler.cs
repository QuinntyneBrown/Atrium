using Atrium.Application.Abstractions;
using Atrium.Application.Common.Exceptions;
using Atrium.Domain.PromptTemplates;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.PromptTemplates;

public sealed class DeletePromptTemplateCommandHandler : IRequestHandler<DeletePromptTemplateCommand>
{
    private readonly IAtriumDbContext _db;

    public DeletePromptTemplateCommandHandler(IAtriumDbContext db) => _db = db;

    public async Task Handle(DeletePromptTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _db.PromptTemplates
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PromptTemplate), request.Id);

        if (template.IsBuiltIn)
        {
            throw new ValidationException("Built-in prompt templates cannot be deleted.");
        }

        _db.PromptTemplates.Remove(template);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
