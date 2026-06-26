using System.Net;
using System.Net.Http.Json;

namespace Atrium.Api.AcceptanceTests.Features.Health;

[TestFixture]
public class HealthAcceptanceTests
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
    public async Task GetHealth_ReturnsOkWithHealthyStatus()
    {
        var response = await _client.GetAsync("/api/health");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var body = await response.Content.ReadFromJsonAsync<HealthDto>();
        Assert.That(body, Is.Not.Null);
        Assert.That(body!.Status, Is.EqualTo("Healthy"));
    }

    private sealed record HealthDto(string Status);
}
