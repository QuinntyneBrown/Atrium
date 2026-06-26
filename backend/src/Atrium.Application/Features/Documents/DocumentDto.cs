using Atrium.Domain.Documents;

namespace Atrium.Application.Features.Documents;

public sealed record DocumentDto(
    Guid Id,
    string Name,
    DocumentType Type,
    string Content,
    IReadOnlyList<string> Tags,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset ModifiedOnUtc);
