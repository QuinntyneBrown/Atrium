using System.Net;
using Atrium.Infrastructure.PlantUml;

namespace Atrium.Infrastructure.UnitTests.PlantUml;

[TestFixture]
public class PlantUmlRendererTests
{
    [Test]
    public async Task RenderSvgAsync_RequestsEncodedSvgPath_AndReturnsBody()
    {
        const string source = "@startuml\nA -> B\n@enduml";
        var expectedPath = "/svg/" + PlantUmlTextEncoder.Encode(source);
        string? requestedPath = null;

        var handler = new StubHttpMessageHandler(request =>
        {
            requestedPath = request.RequestUri!.AbsolutePath;
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("<svg>diagram</svg>")
            };
        });

        using var client = new HttpClient(handler) { BaseAddress = new Uri("http://localhost:8080/") };
        var renderer = new PlantUmlRenderer(client);

        var svg = await renderer.RenderSvgAsync(source);

        Assert.That(requestedPath, Is.EqualTo(expectedPath));
        Assert.That(svg, Is.EqualTo("<svg>diagram</svg>"));
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
