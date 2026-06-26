using System.Net.Http.Json;

namespace Atrium.Api.AcceptanceTests.Features.Chat;

[TestFixture]
public class ChatModelsAcceptanceTests
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
    public async Task GetModels_ReturnsModelsFromOllama()
    {
        var models = await _client.GetFromJsonAsync<List<string>>("/api/chat/models");

        Assert.That(models, Is.EqualTo(new[] { "fake-model-a", "fake-model-b" }));
    }
}
