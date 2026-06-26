using System.Net.Http.Json;

namespace Atrium.Api.AcceptanceTests.Features.Documents;

[TestFixture]
public class ContextPackSeedAcceptanceTests
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
    public async Task DefaultDocuments_IncludeSeededContextPack()
    {
        var documents = await _client.GetFromJsonAsync<List<ContextPackDocument>>("/api/documents?type=Markdown");

        Assert.That(documents, Is.Not.Null);
        var contextPack = documents!.SingleOrDefault(d => d.Name == "context-pack.md");
        Assert.That(contextPack, Is.Not.Null, "context-pack.md should be seeded as a default document");
        Assert.That(contextPack!.Content, Does.Contain("Architecture Description Style Guide"));
    }

    private sealed record ContextPackDocument(Guid Id, string Name, string Content);
}
