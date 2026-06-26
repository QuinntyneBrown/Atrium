namespace Atrium.Application.Abstractions;

public interface IPlantUmlRenderer
{
    Task<string> RenderSvgAsync(string source, CancellationToken cancellationToken = default);
}
