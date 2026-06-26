using MediatR;

namespace Atrium.Application.Features.Health;

public sealed record GetHealthQuery : IRequest<HealthResponse>;
