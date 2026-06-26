using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SignalR.Client;

namespace Atrium.Api.AcceptanceTests.Features.Diagrams;

[TestFixture]
public class DiagramHubAcceptanceTests
{
    private CustomWebApplicationFactory _factory = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new CustomWebApplicationFactory();
        _ = _factory.CreateClient(); // forces the in-memory test server to start
    }

    [TearDown]
    public void TearDown() => _factory.Dispose();

    [Test]
    public async Task Render_PushesRenderedSvgToCaller()
    {
        await using var connection = new HubConnectionBuilder()
            .WithUrl(new Uri(_factory.Server.BaseAddress, "hubs/diagram"), options =>
            {
                // SignalR over TestServer: route through the in-memory handler and use
                // long polling (TestServer does not support raw WebSockets).
                options.HttpMessageHandlerFactory = _ => _factory.Server.CreateHandler();
                options.Transports = HttpTransportType.LongPolling;
            })
            .Build();

        var received = new TaskCompletionSource<(string DocumentId, string Svg)>();
        connection.On<string, string>("DiagramRendered", (documentId, svg) =>
            received.TrySetResult((documentId, svg)));

        await connection.StartAsync();
        await connection.InvokeAsync("Render", "doc-1", "@startuml\nA->B\n@enduml");

        var winner = await Task.WhenAny(received.Task, Task.Delay(TimeSpan.FromSeconds(10)));
        Assert.That(winner, Is.SameAs(received.Task), "DiagramRendered was not received in time");

        var result = await received.Task;
        Assert.That(result.DocumentId, Is.EqualTo("doc-1"));
        Assert.That(result.Svg, Does.Contain("A->B"));
    }
}
