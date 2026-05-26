# TBX Full Stack Challenge

API REST (Node + Express) que consume el API externo, descarga y reformatea los CSV,
y un frontend (React + React Bootstrap) que muestra la información en una tabla.

## Documentación

| Doc | Descripción |
|-----|-------------|
| [docs/guide.md](docs/guide.md) | Cómo levantar el proyecto, correr tests y usar los endpoints |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura del sistema, diagramas de capas y decisiones de diseño |
| [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) | Mejoras identificadas y estrategia de escalabilidad |

## Estructura

```
.
├── api/        # Node + Express (capas: routes → controller → service → gateway + parser)
├── frontend/   # React + React Bootstrap + Redux Toolkit
├── docs/       # Guías de desarrollo y arquitectura
└── docker-compose.yml
```

La API sigue una arquitectura en capas con responsabilidad única por módulo. El
`gateway` (`clients/externalApiClient.js`) es el único que conoce la URL y la API key
del externo, y el `csvParser` es lógica pura, lo que mantiene todo desacoplado y testeable.

## Cómo correr con Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3000

## Cómo correr manualmente

API (Node 14+):

```bash
cd api
npm install
npm start      # http://localhost:3000
npm test       # Mocha + Chai (mockea el API externo con nock)
npm run lint   # StandardJS
```

Frontend (Node 16+):

```bash
cd frontend
npm install
npm start      # http://localhost:8080 (webpack-dev-server)
npm test       # Jest + React Testing Library
npm run build  # build de producción
```

> El frontend toma la URL del API de `API_URL` (default `http://localhost:3000`),
> inyectada en build por Webpack `DefinePlugin`.

## Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/files/data` | Archivos formateados según el schema pedido |
| GET | `/files/data?fileName=file1.csv` | Igual, filtrado por un archivo (opcional) |
| GET | `/files/list` | Lista cruda de archivos del API externo (opcional) |
| GET | `/health` | Healthcheck |
| GET | `/docs` | Documentación interactiva (Swagger UI) |

Respuesta de `/files/data`:

```json
[
  {
    "file": "file1.csv",
    "lines": [
      { "text": "RgTya", "number": 64075909, "hex": "70ad29aacf0b690b0467fe2b2767f765" }
    ]
  }
]
```

## Decisiones

- **Líneas inválidas** (sin las 4 columnas, `number` no numérico o `hex` que no sea de
  32 dígitos) se descartan. Archivos vacíos o que fallan al descargarse se omiten de la
  respuesta sin cortar el resto (`Promise.allSettled`).
- **Node 14 / 16** exigidos por la consigna. Aunque hoy están EOL, se respetan
  para cumplir el requisito; el código es ES6+ sin Babel en la API (CommonJS).

## Puntos opcionales incluidos

API: `GET /files/list`, filtro `?fileName=`, StandardJS.
Frontend: Redux Toolkit, tests con Jest, filtro por `fileName`.
Global: Docker Compose.

# Agregado personal
CI con GitHub Actions (testea API y frontend en cada push).
Documentación Swagger UI (OpenAPI 3.0).