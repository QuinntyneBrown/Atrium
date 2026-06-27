using System.Net.Http.Json;
using Atrium.Api.AcceptanceTests.Fakes;
using Atrium.Application.Features.Chat;

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
    public async Task GetModels_ReturnsModelsAndConfiguredDefaultFromOllama()
    {
        var result = await _client.GetFromJsonAsync<ChatModelsResult>("/api/chat/models");

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Models, Is.EqualTo(FakeOllamaClient.Models));
        Assert.That(result.DefaultModel, Is.EqualTo(FakeOllamaClient.Models[0]));
    }
}
