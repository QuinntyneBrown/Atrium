using Atrium.Application.Features.Health;

namespace Atrium.Application.UnitTests.Features.Health;

[TestFixture]
public class GetHealthQueryHandlerTests
{
    [Test]
    public async Task Handle_ReturnsHealthyStatus()
    {
        var handler = new GetHealthQueryHandler();

        var result = await handler.Handle(new GetHealthQuery(), CancellationToken.None);

        Assert.That(result.Status, Is.EqualTo("Healthy"));
    }
}
