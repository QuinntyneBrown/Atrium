using MediatR;

namespace Atrium.Application.Features.Health;

public sealed class GetHealthQueryHandler : IRequestHandler<GetHealthQuery, HealthResponse>
{
    public Task<HealthResponse> Handle(GetHealthQuery request, CancellationToken cancellationToken)
        => Task.FromResult(new HealthResponse("Healthy"));
}
