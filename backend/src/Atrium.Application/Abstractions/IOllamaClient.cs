using Atrium.Application.Features.Chat;

namespace Atrium.Application.Abstractions;

public interface IOllamaClient
{
    /// <summary>Streams assistant tokens from Ollama's <c>/api/chat</c> endpoint as they arrive.</summary>
    IAsyncEnumerable<string> StreamChatAsync(OllamaChatRequest request, CancellationToken cancellationToken = default);

    /// <summary>Returns the names of the models available locally (Ollama's <c>/api/tags</c>).</summary>
    Task<IReadOnlyList<string>> GetModelsAsync(CancellationToken cancellationToken = default);
}
