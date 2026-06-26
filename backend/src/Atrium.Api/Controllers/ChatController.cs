using Atrium.Application.Features.Chat;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Atrium.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ISender _sender;

    public ChatController(ISender sender) => _sender = sender;

    /// <summary>Lists the models available from the local Ollama server (for the chat model picker).</summary>
    [HttpGet("models")]
    public async Task<ActionResult<IReadOnlyList<string>>> Models(CancellationToken cancellationToken)
        => Ok(await _sender.Send(new GetModelsQuery(), cancellationToken));
}
