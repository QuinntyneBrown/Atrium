using MediatR;

namespace Atrium.Application.Features.Chat;

public sealed record GetModelsQuery : IRequest<IReadOnlyList<string>>;
