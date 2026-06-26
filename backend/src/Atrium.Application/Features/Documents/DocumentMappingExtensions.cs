using Atrium.Domain.Documents;

namespace Atrium.Application.Features.Documents;

public static class DocumentMappingExtensions
{
    public static DocumentDto ToDto(this Document document) =>
        new(
            document.Id,
            document.Name,
            document.Type,
            document.Content,
            document.Tags.ToList(),
            document.CreatedOnUtc,
            document.ModifiedOnUtc);
}
