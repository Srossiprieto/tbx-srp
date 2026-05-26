# Dev Guide — tbx-srp

## Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 14+ (API), 16+ (Frontend) |
| npm         | incluido con Node |
| Docker      | cualquier versión reciente (opcional) |

---

## Opción A — Docker (recomendado, todo junto)

```bash
# En la raíz del proyecto
docker compose up --build
```

| Servicio  | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:8080        |
| API       | http://localhost:3000        |
| Swagger   | http://localhost:3000/docs   |
| Health    | http://localhost:3000/health |

Para bajar los contenedores:
```bash
docker compose down
```

---

## Opción B — Manual (dos terminales)

### Terminal 1 — API

```bash
cd api

# Instalar dependencias (solo la primera vez)
npm install

# Crear .env desde el ejemplo (solo la primera vez)
cp .env.example .env

# Levantar
npm start
```

Salida esperada:
```
API escuchando en el puerto 3000
```

### Terminal 2 — Frontend

```bash
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Levantar dev server con hot-reload
npm start
```

Salida esperada:
```
<i> [webpack-dev-server] Loopback: http://localhost:8080/
```

> El frontend usa `API_URL=http://localhost:3000` por defecto.
> Si tu API corre en otro puerto, exportá la variable antes de `npm start`:
> ```bash
> API_URL=http://localhost:4000 npm start
> ```

---

## Variables de entorno (API)

Archivo: `api/.env` (no se commitea, está en `.gitignore`)

```env
PORT=3000
EXTERNAL_API_URL=https://echo-serv.tbxnet.com/v1
EXTERNAL_API_KEY=aSuperSecretKey
EXTERNAL_API_TIMEOUT=15000
```

---

## Tests

### API — Mocha + Chai + Nock + Supertest

```bash
cd api
npm test
```

**Qué se testea:**

| Archivo de test              | Qué cubre                                              |
|-----------------------------|--------------------------------------------------------|
| `csvParser.test.js`         | Parseo de líneas válidas, inválidas, vacías, hex roto  |
| `filesService.test.js`      | Descarga paralela, filtro por fileName, archivo caído  |
| `externalApiClient.test.js` | Validación de nombres de archivo (path traversal)      |
| `filesApi.test.js`          | Endpoints `/files/data` y `/files/list` end-to-end     |
| `docs.test.js`              | Swagger UI y spec OpenAPI disponibles                  |

Salida esperada:
```
  csvParser
    ✓ parsea líneas válidas y arma el schema pedido
    ✓ descarta líneas con datos faltantes
    ✓ descarta líneas con hex inválido
    ✓ maneja archivos vacíos

  filesService
    ✓ descarga, formatea y omite archivos sin líneas válidas
    ✓ no falla si un archivo no se puede descargar
    ✓ filtra por fileName

  externalApiClient.isValidFileName
    ✓ acepta nombres de archivo normales
    ✓ rechaza path traversal y barras

  Endpoints /files
    ✓ GET /files/data responde 200 con la info formateada
    ✓ GET /files/data?fileName= filtra un archivo
    ✓ GET /files/list devuelve la lista cruda del API externo

  OpenAPI docs
    ✓ GET /docs.json expone la especificación OpenAPI
    ✓ GET /docs/ sirve la UI de Swagger

  14 passing
```

> Los tests **mockean el API externo con nock** — no necesitás conexión real ni API key válida.

---

### Frontend — Jest + React Testing Library

```bash
cd frontend
npm test
```

**Qué se testea:**

| Archivo de test                          | Qué cubre                                   |
|-----------------------------------------|---------------------------------------------|
| `components/__tests__/FilesTable.test.js` | Renderizado de filas, headers, datos reales |

Salida esperada:
```
  FilesTable
    ✓ renderiza una fila por cada línea de cada archivo
    ✓ muestra los encabezados del wireframe

  2 passing
```

Para modo watch (re-corre al guardar):
```bash
npm test -- --watch
```

---

## Lint (API)

La API usa [StandardJS](https://standardjs.com/) — sin punto y coma, sin config, reglas fijas.

```bash
cd api
npm run lint
```

Salida esperada: ningún output = todo ok.

Para auto-fix:
```bash
npx standard --fix
```

---

## Endpoints

Base URL: `http://localhost:3000`

| Método | Ruta                          | Descripción                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/health`                     | Healthcheck `{ status: "ok" }`           |
| GET    | `/files/list`                 | Lista de archivos del API externo        |
| GET    | `/files/data`                 | Todos los archivos formateados           |
| GET    | `/files/data?fileName=X.csv`  | Solo el archivo indicado                 |
| GET    | `/docs`                       | Swagger UI interactiva                   |
| GET    | `/docs.json`                  | Spec OpenAPI en JSON                     |

### Ejemplo de respuesta `/files/data`

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

### Probar con curl

```bash
# Todos los archivos
curl http://localhost:3000/files/data | json_pp

# Filtrado
curl "http://localhost:3000/files/data?fileName=file1.csv" | json_pp

# Lista cruda
curl http://localhost:3000/files/list | json_pp

# Health
curl http://localhost:3000/health
```

---

## Build de producción (Frontend)

```bash
cd frontend
npm run build
# Output en frontend/dist/
```

---

## Troubleshooting

**`Error: Cannot find module`**
→ Corrés `npm install` dentro de la carpeta correcta (`api/` o `frontend/`).

**Puerto 3000 o 8080 ocupado**
```bash
lsof -i :3000   # ver qué proceso lo usa
kill -9 <PID>
```

**Docker: frontend no puede hablar con la API**
→ Revisá que `docker-compose.yml` use `http://api:3000` como `API_URL`, no `localhost`.

**Tests de API fallan con timeout**
→ Nock intercepta las llamadas HTTP. Si ves timeout, algún test no configuró el mock. Revisá `afterEach(() => nock.cleanAll())`.
