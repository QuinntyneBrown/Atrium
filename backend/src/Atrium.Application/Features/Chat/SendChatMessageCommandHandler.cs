using Atrium.Application.Abstractions;
using MediatR;

namespace Atrium.Application.Features.Chat;

public sealed class SendChatMessageCommandHandler : IStreamRequestHandler<SendChatMessageCommand, string>
{
    private readonly IOllamaClient _ollama;

    public SendChatMessageCommandHandler(IOllamaClient ollama) => _ollama = ollama;

    public IAsyncEnumerable<string> Handle(SendChatMessageCommand request, CancellationToken cancellationToken)
        => _ollama.StreamChatAsync(new OllamaChatRequest(request.Model, request.Messages), cancellationToken);
}
