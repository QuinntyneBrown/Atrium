using Atrium.Application.Abstractions;
using MediatR;

namespace Atrium.Application.Features.Chat;

public sealed class GetModelsQueryHandler : IRequestHandler<GetModelsQuery, ChatModelsResult>
{
    private readonly IOllamaClient _ollama;
    private readonly OllamaOptions _options;

    public GetModelsQueryHandler(IOllamaClient ollama, OllamaOptions options)
    {
        _ollama = ollama;
        _options = options;
    }

    public async Task<ChatModelsResult> Handle(GetModelsQuery request, CancellationToken cancellationToken)
    {
        var models = await _ollama.GetModelsAsync(cancellationToken);
        return new ChatModelsResult(models, _options.DefaultModel);
    }
}
