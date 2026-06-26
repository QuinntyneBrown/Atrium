using Atrium.Application.Features.Chat;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SignalR.Client;

namespace Atrium.Api.AcceptanceTests.Features.Chat;

[TestFixture]
public class ChatHubAcceptanceTests
{
    private CustomWebApplicationFactory _factory = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new CustomWebApplicationFactory();
        _ = _factory.CreateClient();
    }

    [TearDown]
    public void TearDown() => _factory.Dispose();

    [Test]
    public async Task StreamChat_StreamsAssistantTokensToCaller()
    {
        await using var connection = new HubConnectionBuilder()
            .WithUrl(new Uri(_factory.Server.BaseAddress, "hubs/chat"), options =>
            {
                options.HttpMessageHandlerFactory = _ => _factory.Server.CreateHandler();
                options.Transports = HttpTransportType.LongPolling;
            })
            .Build();

        await connection.StartAsync();

        var command = new SendChatMessageCommand(
            "fake-model-a",
            new List<OllamaChatMessage> { new("user", "hello") });

        var tokens = new List<string>();
        await foreach (var token in connection.StreamAsync<string>("StreamChat", command))
        {
            tokens.Add(token);
        }

        Assert.That(string.Concat(tokens), Is.EqualTo("Hello, world"));
    }
}
