using Atrium.Application;
using Atrium.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AtriumCors";

builder.Services.AddControllers();
builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.AddCors(options =>
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins(builder.Configuration.GetValue<string>("Cors:AllowedOrigins") ?? "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

var app = builder.Build();

app.UseCors(CorsPolicy);
app.MapControllers();

app.Run();

public partial class Program { }
