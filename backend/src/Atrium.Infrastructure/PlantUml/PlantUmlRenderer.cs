using Atrium.Application.Abstractions;

namespace Atrium.Infrastructure.PlantUml;

/// <summary>
/// Renders PlantUML source to SVG via a PlantUML server (e.g. the dockerised
/// <c>plantuml/plantuml-server</c>). The typed <see cref="HttpClient"/> is configured with the
/// server base address in <c>AddInfrastructure</c>.
/// </summary>
public sealed class PlantUmlRenderer : IPlantUmlRenderer
{
    private readonly HttpClient _httpClient;

    public PlantUmlRenderer(HttpClient httpClient) => _httpClient = httpClient;

    public async Task<string> RenderSvgAsync(string source, CancellationToken cancellationToken = default)
    {
        var encoded = PlantUmlTextEncoder.Encode(source);

        using var response = await _httpClient.GetAsync($"svg/{encoded}", cancellationToken);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync(cancellationToken);
    }
}
