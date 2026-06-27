using System.Net;
using Atrium.Application.Features.Chat;
using Atrium.Infrastructure.Ollama;

namespace Atrium.Infrastructure.UnitTests.Ollama;

[TestFixture]
public class OllamaClientTests
{
    [Test]
    public async Task StreamChatAsync_YieldsAssistantTokens_UntilDone()
    {
        var ndjson = string.Join("\n",
            "{\"message\":{\"role\":\"assistant\",\"content\":\"Hello\"},\"done\":false}",
            "{\"message\":{\"role\":\"assistant\",\"content\":\" world\"},\"done\":false}",
            "{\"message\":{\"role\":\"assistant\",\"content\":\"\"},\"done\":true}",
            "{\"message\":{\"role\":\"assistant\",\"content\":\"IGNORED\"},\"done\":false}");

        using var client = new HttpClient(new StubHttpMessageHandler(_ =>
            new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(ndjson) }))
        {
            BaseAddress = new Uri("http://localhost:11434/")
        };
        var ollama = new OllamaClient(client);

        var tokens = new List<string>();
        await foreach (var token in ollama.StreamChatAsync(
            new OllamaChatRequest("model", new[] { new OllamaChatMessage("user", "hi") })))
        {
            tokens.Add(token);
        }

        Assert.That(tokens, Is.EqualTo(new[] { "Hello", " world" }));
    }

    [Test]
    public async Task GetModelsAsync_ReturnsModelNames()
    {
        const string json = "{\"models\":[{\"name\":\"qwen2.5-coder:14b\"},{\"name\":\"llama3.1\"}]}";

        using var client = new HttpClient(new StubHttpMessageHandler(_ =>
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
            }))
        {
            BaseAddress = new Uri("http://localhost:11434/")
        };
        var ollama = new OllamaClient(client);

        var models = await ollama.GetModelsAsync();

        Assert.That(models, Is.EqualTo(new[] { "qwen2.5-coder:14b", "llama3.1" }));
    }

    [Test]
    public void StreamChatAsync_ThrowsWhenOllamaReturnsAnInlineErrorLine()
    {
        // Ollama answers HTTP 200 then emits an {"error":"..."} NDJSON line on a runtime failure.
        const string ndjson = "{\"error\":\"model 'ghost' not found\"}";

        using var client = new HttpClient(new StubHttpMessageHandler(_ =>
            new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(ndjson) }))
        {
            BaseAddress = new Uri("http://localhost:11434/")
        };
        var ollama = new OllamaClient(client);

        Assert.That(async () =>
        {
            await foreach (var _ in ollama.StreamChatAsync(
                new OllamaChatRequest("ghost", Array.Empty<OllamaChatMessage>())))
            {
            }
        }, Throws.TypeOf<InvalidOperationException>());
    }

    private sealed class StubHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, HttpResponseMessage> _responder;

        public StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder)
            => _responder = responder;

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
            => Task.FromResult(_responder(request));
    }
}
