namespace Atrium.Domain.Documents;

public class Document
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DocumentType Type { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();

    public DateTimeOffset CreatedOnUtc { get; set; }

    public DateTimeOffset ModifiedOnUtc { get; set; }
}
