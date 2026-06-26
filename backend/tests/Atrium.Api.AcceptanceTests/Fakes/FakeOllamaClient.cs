using System.Runtime.CompilerServices;
using Atrium.Application.Abstractions;
using Atrium.Application.Features.Chat;

namespace Atrium.Api.AcceptanceTests.Fakes;

/// <summary>
/// Deterministic stand-in for Ollama so acceptance tests never depend on a running model.
/// </summary>
public sealed class FakeOllamaClient : IOllamaClient
{
    public static readonly string[] Tokens = { "Hello", ", ", "world" };
    public static readonly string[] Models = { "fake-model-a", "fake-model-b" };

    public async IAsyncEnumerable<string> StreamChatAsync(
        OllamaChatRequest request, [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        foreach (var token in Tokens)
        {
            cancellationToken.ThrowIfCancellationRequested();
            yield return token;
            await Task.Yield();
        }
    }

    public Task<IReadOnlyList<string>> GetModelsAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<string>>(Models);
}
