using System.Net;
using System.Net.Http.Json;

namespace Atrium.Api.AcceptanceTests.Features.Documents;

[TestFixture]
public class DocumentsAcceptanceTests
{
    private CustomWebApplicationFactory _factory = null!;
    private HttpClient _client = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new CustomWebApplicationFactory();
        _client = _factory.CreateClient();
    }

    [TearDown]
    public void TearDown()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [Test]
    public async Task CreateThenGetById_ReturnsPersistedDocument()
    {
        var create = new CreateDocumentRequest("Sequence", "Puml", "@startuml\nA->B\n@enduml", new[] { "draft" });

        var post = await _client.PostAsJsonAsync("/api/documents", create);
        Assert.That(post.StatusCode, Is.EqualTo(HttpStatusCode.Created));

        var created = await post.Content.ReadFromJsonAsync<DocumentResponse>();
        Assert.That(created, Is.Not.Null);
        Assert.That(created!.Id, Is.Not.EqualTo(Guid.Empty));
        Assert.That(created.Name, Is.EqualTo("Sequence"));
        Assert.That(created.Type, Is.EqualTo("Puml"));
        Assert.That(created.Tags, Is.EquivalentTo(new[] { "draft" }));

        var get = await _client.GetAsync($"/api/documents/{created.Id}");
        Assert.That(get.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        var fetched = await get.Content.ReadFromJsonAsync<DocumentResponse>();
        Assert.That(fetched!.Content, Is.EqualTo(create.Content));
    }

    [Test]
    public async Task GetDocuments_FiltersByType()
    {
        await _client.PostAsJsonAsync("/api/documents",
            new CreateDocumentRequest("Diagram", "Puml", "@startuml\n@enduml", Array.Empty<string>()));
        await _client.PostAsJsonAsync("/api/documents",
            new CreateDocumentRequest("Notes", "Markdown", "# notes", Array.Empty<string>()));

        var response = await _client.GetAsync("/api/documents?type=Markdown");
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var list = await response.Content.ReadFromJsonAsync<List<DocumentResponse>>();
        Assert.That(list, Is.Not.Null);
        Assert.That(list!.All(d => d.Type == "Markdown"), Is.True);
        Assert.That(list.Any(d => d.Name == "Notes"), Is.True);
    }

    [Test]
    public async Task UpdateDocument_ChangesContent()
    {
        var post = await _client.PostAsJsonAsync("/api/documents",
            new CreateDocumentRequest("Doc", "Markdown", "old", Array.Empty<string>()));
        var created = await post.Content.ReadFromJsonAsync<DocumentResponse>();

        var put = await _client.PutAsJsonAsync($"/api/documents/{created!.Id}",
            new UpdateDocumentRequest("Doc", "new content", new[] { "edited" }));
        Assert.That(put.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var updated = await put.Content.ReadFromJsonAsync<DocumentResponse>();
        Assert.That(updated!.Content, Is.EqualTo("new content"));
        Assert.That(updated.Tags, Is.EquivalentTo(new[] { "edited" }));
    }

    [Test]
    public async Task DeleteDocument_RemovesIt()
    {
        var post = await _client.PostAsJsonAsync("/api/documents",
            new CreateDocumentRequest("Temp", "Markdown", "x", Array.Empty<string>()));
        var created = await post.Content.ReadFromJsonAsync<DocumentResponse>();

        var delete = await _client.DeleteAsync($"/api/documents/{created!.Id}");
        Assert.That(delete.StatusCode, Is.EqualTo(HttpStatusCode.NoContent));

        var get = await _client.GetAsync($"/api/documents/{created.Id}");
        Assert.That(get.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    private sealed record CreateDocumentRequest(string Name, string Type, string Content, string[] Tags);

    private sealed record UpdateDocumentRequest(string Name, string Content, string[] Tags);

    private sealed record DocumentResponse(
        Guid Id, string Name, string Type, string Content, string[] Tags,
        DateTimeOffset CreatedOnUtc, DateTimeOffset ModifiedOnUtc);
}
