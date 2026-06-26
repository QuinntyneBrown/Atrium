using Microsoft.Extensions.DependencyInjection;

namespace Atrium.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // M1+ registers AtriumDbContext (SQLite), IOllamaClient and IPlantUmlRenderer here.
        return services;
    }
}
