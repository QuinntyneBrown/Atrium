using Atrium.Application.Abstractions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Atrium.Application.Features.PromptTemplates;

public sealed class GetPromptTemplatesQueryHandler
    : IRequestHandler<GetPromptTemplatesQuery, IReadOnlyList<PromptTemplateDto>>
{
    private readonly IAtriumDbContext _db;

    public GetPromptTemplatesQueryHandler(IAtriumDbContext db) => _db = db;

    public async Task<IReadOnlyList<PromptTemplateDto>> Handle(
        GetPromptTemplatesQuery request, CancellationToken cancellationToken)
    {
        var templates = await _db.PromptTemplates.AsNoTracking().ToListAsync(cancellationToken);

        return templates
            .OrderByDescending(t => t.IsBuiltIn)
            .ThenBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
            .Select(t => t.ToDto())
            .ToList();
    }
}
