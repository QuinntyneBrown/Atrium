using Atrium.Application.Features.Chat;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Atrium.Api.Hubs;

/// <summary>
/// Streams an Ollama chat response token-by-token to the calling client. The client invokes
/// <c>StreamChat</c> and consumes the returned stream (SignalR server-to-client streaming).
/// </summary>
public sealed class ChatHub : Hub
{
    private readonly ISender _sender;

    public ChatHub(ISender sender) => _sender = sender;

    public IAsyncEnumerable<string> StreamChat(SendChatMessageCommand command, CancellationToken cancellationToken)
        => _sender.CreateStream(command, cancellationToken);
}
