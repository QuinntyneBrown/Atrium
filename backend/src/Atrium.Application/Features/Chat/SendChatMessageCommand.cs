using MediatR;

namespace Atrium.Application.Features.Chat;

/// <summary>
/// A chat turn assembled by the prompt builder (system/template + attached document context + user
/// input become <see cref="Messages"/>). Streamed: the handler yields assistant tokens as they arrive.
/// </summary>
public sealed record SendChatMessageCommand(string Model, List<OllamaChatMessage> Messages)
    : IStreamRequest<string>;
