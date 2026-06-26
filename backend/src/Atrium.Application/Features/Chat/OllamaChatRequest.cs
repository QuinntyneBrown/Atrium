namespace Atrium.Application.Features.Chat;

public sealed record OllamaChatRequest(string Model, IReadOnlyList<OllamaChatMessage> Messages);
