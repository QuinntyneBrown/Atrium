using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Atrium.Application.Abstractions;
using Atrium.Application.Features.Chat;

namespace Atrium.Infrastructure.Ollama;

/// <summary>
/// Talks to a local Ollama server. Chat responses arrive as newline-delimited JSON (NDJSON) when
/// <c>stream:true</c>; this client reads the response as it streams (ResponseHeadersRead) and yields
/// each assistant token as it is parsed.
/// </summary>
public sealed class OllamaClient : IOllamaClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public OllamaClient(HttpClient httpClient) => _httpClient = httpClient;

    public async IAsyncEnumerable<string> StreamChatAsync(
        OllamaChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var payload = new ChatRequestWire
        {
            Model = request.Model,
            Stream = true,
            Messages = request.Messages.Select(m => new MessageWire { Role = m.Role, Content = m.Content }).ToList()
        };

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "api/chat")
        {
            Content = JsonContent.Create(payload, options: JsonOptions)
        };

        using var response = await _httpClient.SendAsync(
            httpRequest, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        // Drive the loop entirely off the async, cancellable read — StreamReader.EndOfStream is a
        // blocking sync probe that would park a thread and ignore cancellation between tokens.
        string? line;
        while ((line = await reader.ReadLineAsync(cancellationToken)) is not null)
        {
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            ChatChunkWire? chunk;
            try
            {
                chunk = JsonSerializer.Deserialize<ChatChunkWire>(line, JsonOptions);
            }
            catch (JsonException)
            {
                continue;
            }

            // Ollama returns HTTP 200 and then an inline {"error":"..."} line when generation fails
            // mid-stream (model crash, OOM, context overflow). Surface it instead of silently
            // truncating the response to an empty/partial answer.
            if (!string.IsNullOrEmpty(chunk?.Error))
            {
                throw new InvalidOperationException($"Ollama chat error: {chunk!.Error}");
            }

            var token = chunk?.Message?.Content;
            if (!string.IsNullOrEmpty(token))
            {
                yield return token!;
            }

            if (chunk?.Done == true)
            {
                yield break;
            }
        }
    }

    public async Task<IReadOnlyList<string>> GetModelsAsync(CancellationToken cancellationToken = default)
    {
        var tags = await _httpClient.GetFromJsonAsync<TagsWire>("api/tags", JsonOptions, cancellationToken);

        return tags?.Models?
            .Select(m => m.Name)
            .Where(name => !string.IsNullOrEmpty(name))
            .ToList() ?? new List<string>();
    }

    private sealed class ChatRequestWire
    {
        public string Model { get; set; } = string.Empty;
        public bool Stream { get; set; }
        public List<MessageWire> Messages { get; set; } = new();
    }

    private sealed class MessageWire
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    private sealed class ChatChunkWire
    {
        public MessageWire? Message { get; set; }
        public bool Done { get; set; }
        public string? Error { get; set; }
    }

    private sealed class TagsWire
    {
        public List<ModelWire>? Models { get; set; }
    }

    private sealed class ModelWire
    {
        public string Name { get; set; } = string.Empty;
    }
}
