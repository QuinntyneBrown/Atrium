using System.Text.Json.Serialization;
using Atrium.Api.Common;
using Atrium.Api.Hubs;
using Atrium.Application;
using Atrium.Infrastructure;
using Atrium.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AtriumCors";

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins(builder.Configuration.GetValue<string>("Cors:AllowedOrigins") ?? "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AtriumDbContext>();
    db.Database.Migrate();
    await DataSeeder.SeedAsync(db);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors(CorsPolicy);
app.MapControllers();
app.MapHub<DiagramHub>("/hubs/diagram");
app.MapHub<ChatHub>("/hubs/chat");

app.Run();

public partial class Program { }
