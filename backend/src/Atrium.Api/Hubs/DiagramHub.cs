using Atrium.Application.Abstractions;
using Microsoft.AspNetCore.SignalR;

namespace Atrium.Api.Hubs;

/// <summary>
/// Real-time PlantUML rendering. A client invokes <see cref="Render"/> with the live source as it
/// edits; the server renders it to SVG and pushes <c>DiagramRendered(documentId, svg)</c> back to
/// the calling connection.
/// </summary>
public sealed class DiagramHub : Hub
{
    private readonly IPlantUmlRenderer _renderer;

    public DiagramHub(IPlantUmlRenderer renderer) => _renderer = renderer;

    public async Task Render(string documentId, string source)
    {
        var svg = await _renderer.RenderSvgAsync(source, Context.ConnectionAborted);
        await Clients.Caller.SendAsync("DiagramRendered", documentId, svg);
    }
}
