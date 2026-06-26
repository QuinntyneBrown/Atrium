using Atrium.Application.Abstractions;
using Atrium.Infrastructure.Ollama;
using Atrium.Infrastructure.Persistence;
using Atrium.Infrastructure.PlantUml;
using Atrium.Infrastructure.Time;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Atrium.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Atrium") ?? "Data Source=atrium.db";
        services.AddDbContext<AtriumDbContext>(options => options.UseSqlite(connectionString));
        services.AddScoped<IAtriumDbContext>(sp => sp.GetRequiredService<AtriumDbContext>());
        services.AddSingleton<IClock, SystemClock>();

        var plantUmlBaseUrl = configuration["PlantUml:BaseUrl"] ?? "http://localhost:8080";
        services.AddHttpClient<IPlantUmlRenderer, PlantUmlRenderer>(client =>
            client.BaseAddress = new Uri(plantUmlBaseUrl.TrimEnd('/') + "/"));

        var ollamaBaseUrl = configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";
        services.AddHttpClient<IOllamaClient, OllamaClient>(client =>
        {
            client.BaseAddress = new Uri(ollamaBaseUrl.TrimEnd('/') + "/");
            client.Timeout = Timeout.InfiniteTimeSpan; // chat streams can run long
        });

        return services;
    }
}
