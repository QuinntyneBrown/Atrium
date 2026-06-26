using Atrium.Application.Features.PromptTemplates;
using Atrium.Domain.PromptTemplates;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Atrium.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromptTemplatesController : ControllerBase
{
    private readonly ISender _sender;

    public PromptTemplatesController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PromptTemplateDto>>> Get(CancellationToken cancellationToken)
        => Ok(await _sender.Send(new GetPromptTemplatesQuery(), cancellationToken));

    [HttpPost]
    public async Task<ActionResult<PromptTemplateDto>> Create(
        [FromBody] CreatePromptTemplateCommand command, CancellationToken cancellationToken)
    {
        var created = await _sender.Send(command, cancellationToken);
        return Created($"/api/prompttemplates/{created.Id}", created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PromptTemplateDto>> Update(
        Guid id, [FromBody] UpdatePromptTemplateBody body, CancellationToken cancellationToken)
        => Ok(await _sender.Send(new UpdatePromptTemplateCommand(id, body.Name, body.Mode, body.Body), cancellationToken));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeletePromptTemplateCommand(id), cancellationToken);
        return NoContent();
    }

    public sealed record UpdatePromptTemplateBody(string Name, PromptMode Mode, string Body);
}
