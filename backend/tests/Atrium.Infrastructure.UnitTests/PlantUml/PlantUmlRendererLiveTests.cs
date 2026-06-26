using Atrium.Infrastructure.PlantUml;

namespace Atrium.Infrastructure.UnitTests.PlantUml;

/// <summary>
/// Live integration check against the dockerised <c>plantuml-server</c>. Marked
/// <see cref="ExplicitAttribute"/> so the normal unit-test run skips it; execute on demand with
/// <c>dotnet test --filter Category=Live</c> while <c>docker compose up plantuml-server</c> is running.
/// </summary>
[TestFixture]
[Category("Live")]
[Explicit("Requires the dockerised plantuml-server on http://localhost:8080")]
public class PlantUmlRendererLiveTests
{
    [Test]
    public async Task RenderSvgAsync_AgainstRealServer_ReturnsRenderedSvg()
    {
        using var client = new HttpClient { BaseAddress = new Uri("http://localhost:8080/") };
        var renderer = new PlantUmlRenderer(client);

        var svg = await renderer.RenderSvgAsync("@startuml\nAlice -> Bob : hello\n@enduml");

        Assert.That(svg, Does.Contain("<svg"));
        Assert.That(svg, Does.Contain("Alice"));
    }
}
