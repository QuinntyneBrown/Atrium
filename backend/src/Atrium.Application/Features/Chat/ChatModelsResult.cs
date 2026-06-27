namespace Atrium.Application.Features.Chat;

/// <summary>
/// Result of <see cref="GetModelsQuery"/>: the models available on the local Ollama host plus the
/// configured default the chat UI should pre-select (when present in <see cref="Models"/>).
/// </summary>
public sealed record ChatModelsResult(IReadOnlyList<string> Models, string DefaultModel);
