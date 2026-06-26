using System.Data.Common;
using Atrium.Api.AcceptanceTests.Fakes;
using Atrium.Application.Abstractions;
using Atrium.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Atrium.Api.AcceptanceTests;

/// <summary>
/// Boundary-interface test host. Tests drive the application only through its HTTP/SignalR
/// surface — never through internals. The file-backed SQLite database is swapped for a private
/// in-memory SQLite connection kept open for the lifetime of the factory, giving each test
/// fixture an isolated schema. M3 will additionally replace <c>IOllamaClient</c> and
/// <c>IPlantUmlRenderer</c> with deterministic in-test doubles here.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private DbConnection? _connection;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AtriumDbContext>>();
            services.RemoveAll<AtriumDbContext>();

            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            services.AddDbContext<AtriumDbContext>(options => options.UseSqlite(_connection));

            // External renderer replaced with a deterministic fake — tests never hit Docker.
            services.RemoveAll<IPlantUmlRenderer>();
            services.AddSingleton<IPlantUmlRenderer>(new FakePlantUmlRenderer());

            // External LLM replaced with a deterministic fake — tests never hit Ollama.
            services.RemoveAll<IOllamaClient>();
            services.AddSingleton<IOllamaClient>(new FakeOllamaClient());
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            _connection?.Dispose();
        }
    }
}
