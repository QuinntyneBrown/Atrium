using Atrium.Application.Features.Health;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Atrium.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ISender _sender;

    public HealthController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<HealthResponse>> Get(CancellationToken cancellationToken)
        => Ok(await _sender.Send(new GetHealthQuery(), cancellationToken));
}
