# Atrium

A workbench for **architecture description** work. Atrium pairs a repository of architecture documents
(`.puml`, `.drawio`, `.md`) with a local-LLM (Ollama) chat purpose-built for architecture: assemble a
prompt from predefined or custom templates, drag documents in as context, and get a streamed response.
PlantUML diagrams render **live** as you edit. The ISO/IEC/IEEE 42010:2022
[context-pack](https://github.com/QuinntyneBrown/architecture-description-style-guide/blob/main/resources/ollama/context-pack.md)
ships as a default attachable resource (CHECK / CORRECT / AUTHOR modes).

## Layout

| Folder | Stack |
|---|---|
| `backend/` | .NET 8, Clean Architecture, MediatR, EF Core (SQLite), NUnit |
| `frontend/` | Angular 17.2.2, Angular Material, Jest |
| `e2e/` | Playwright, Page Object Model |

## Prerequisites

- .NET SDK capable of building `net8.0` (the repo pins a stable SDK via `global.json`)
- Node 20 LTS (recommended for Angular 17 tooling)
- Docker (for the PlantUML render server)
- Ollama running locally (`ollama serve`), with at least one model pulled

## Run (full stack in Docker)

One command brings up the frontend, API, and PlantUML renderer (Ollama stays native on the host):

```bash
ollama serve                 # on the host (:11434), with a model pulled
docker compose up --build    # frontend :8088, API :5080, plantuml :8080
```

Then open **http://localhost:8088**. The frontend (nginx) reverse-proxies `/api` and `/hubs`
(WebSockets) to the API container; the API reaches host Ollama via `host.docker.internal` and the
renderer via the `plantuml-server` service. SQLite persists in the `atrium-data` volume. Tear down
with `docker compose down` (add `-v` to also drop the database volume).

## Run (local dev)

```bash
docker compose up -d plantuml-server          # PlantUML renderer on :8080 (just this service)
ollama serve                                  # Ollama on :11434 (if not already running)
dotnet run --project backend/src/Atrium.Api   # API on :5080
cd frontend && npm start                      # Angular on :4200
```

## Test

```bash
dotnet test backend/Atrium.slnx               # backend unit + acceptance
cd frontend && npm test                       # Jest unit
cd e2e && npx playwright test                 # end-to-end (POM)
```

Built with Acceptance Test Driven Development: a failing test precedes each behaviour.
