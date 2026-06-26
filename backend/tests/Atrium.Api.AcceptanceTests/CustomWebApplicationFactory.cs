using Microsoft.AspNetCore.Mvc.Testing;

namespace Atrium.Api.AcceptanceTests;

/// <summary>
/// Boundary-interface test host. Tests drive the application only through its HTTP/SignalR
/// surface — never through internals. From M1 onward this factory replaces external
/// dependencies (SQLite, <c>IOllamaClient</c>, <c>IPlantUmlRenderer</c>) with deterministic
/// in-test doubles via <see cref="WebApplicationFactory{TEntryPoint}.WithWebHostBuilder"/>.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
}
