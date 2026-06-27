# syntax=docker/dockerfile:1

# ---- build ----
# Build context is ./backend, so the repo-root global.json pin does not apply here;
# the net8.0 projects build directly on the .NET 8 SDK. The Api csproj is published
# directly (not the .slnx) so no newer-SDK solution-format support is needed.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore first (better layer caching) — copy only the project files.
COPY src/Atrium.Domain/Atrium.Domain.csproj src/Atrium.Domain/
COPY src/Atrium.Application/Atrium.Application.csproj src/Atrium.Application/
COPY src/Atrium.Infrastructure/Atrium.Infrastructure.csproj src/Atrium.Infrastructure/
COPY src/Atrium.Api/Atrium.Api.csproj src/Atrium.Api/
RUN dotnet restore src/Atrium.Api/Atrium.Api.csproj

# Build + publish.
COPY . .
RUN dotnet publish src/Atrium.Api/Atrium.Api.csproj -c Release -o /app/publish --no-restore

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
RUN mkdir -p /data
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Atrium.Api.dll"]
