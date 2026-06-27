namespace Atrium.Application.Features.Chat;

/// <summary>
/// Ollama-related configuration surfaced to the application layer. <see cref="DefaultModel"/> is the
/// model the chat UI pre-selects when it is available on the host (see <see cref="GetModelsQueryHandler"/>).
/// </summary>
public sealed class OllamaOptions
{
    public string DefaultModel { get; init; } = string.Empty;
}
