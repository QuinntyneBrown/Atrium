using Atrium.Application.Features.Documents;
using Atrium.Domain.Documents;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Atrium.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly ISender _sender;

    public DocumentsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DocumentDto>>> Get(
        [FromQuery] DocumentType? type, CancellationToken cancellationToken)
        => Ok(await _sender.Send(new GetDocumentsQuery(type), cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DocumentDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var document = await _sender.Send(new GetDocumentByIdQuery(id), cancellationToken);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(
        [FromBody] CreateDocumentCommand command, CancellationToken cancellationToken)
    {
        var created = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<DocumentDto>> Update(
        Guid id, [FromBody] UpdateDocumentBody body, CancellationToken cancellationToken)
        => Ok(await _sender.Send(new UpdateDocumentCommand(id, body.Name, body.Content, body.Tags), cancellationToken));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteDocumentCommand(id), cancellationToken);
        return NoContent();
    }

    public sealed record UpdateDocumentBody(string Name, string Content, List<string> Tags);
}
