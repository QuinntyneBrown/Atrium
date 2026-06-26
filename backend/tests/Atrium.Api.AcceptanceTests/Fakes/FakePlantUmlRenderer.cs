using Atrium.Application.Abstractions;

namespace Atrium.Api.AcceptanceTests.Fakes;

/// <summary>
/// Deterministic stand-in for the real renderer so acceptance tests never touch Docker/PlantUML.
/// Echoes the source into the SVG so tests can assert the source flowed through the hub.
/// </summary>
public sealed class FakePlantUmlRenderer : IPlantUmlRenderer
{
    public Task<string> RenderSvgAsync(string source, CancellationToken cancellationToken = default)
        => Task.FromResult($"<svg data-rendered=\"true\">{source}</svg>");
}
