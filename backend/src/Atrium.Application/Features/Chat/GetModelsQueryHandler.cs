using Atrium.Application.Abstractions;
using MediatR;

namespace Atrium.Application.Features.Chat;

public sealed class GetModelsQueryHandler : IRequestHandler<GetModelsQuery, IReadOnlyList<string>>
{
    private readonly IOllamaClient _ollama;

    public GetModelsQueryHandler(IOllamaClient ollama) => _ollama = ollama;

    public Task<IReadOnlyList<string>> Handle(GetModelsQuery request, CancellationToken cancellationToken)
        => _ollama.GetModelsAsync(cancellationToken);
}
