# Mejoras y escalabilidad — tbx-srp

Funcionalidades que quedan fuera del scope del challenge pero que se implementarían
en un contexto de producción real.

---

## Caché en el service

**Problema actual:** cada request a `/files/data` dispara N llamadas al API externo
(1 lista + N descargas). Con tráfico concurrente esto se multiplica.

**Solución:** caché en memoria con TTL corto usando `node-cache`.

```js
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 60 }) // 60 segundos

async function getFilesData(fileName) {
  const key = `files:${fileName || 'all'}`
  const cached = cache.get(key)
  if (cached) return cached

  const result = await fetchAndParse(fileName)
  cache.set(key, result)
  return result
}
```

**Beneficio:** reduce drásticamente la carga sobre el API externo y la latencia
para requests repetidas. En un entorno multi-instancia se reemplazaría `node-cache`
por **Redis**.

---

## Rate limiting

**Problema actual:** la API no tiene límite de requests, cualquier cliente puede
saturarla (y por extensión el API externo que tiene su propio rate limit).

**Solución:** `express-rate-limit` como middleware global.

```js
const rateLimit = require('express-rate-limit')

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,            // 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false
}))
```

---

## CORS restrictivo

**Problema actual:** `app.use(cors())` permite cualquier origen.

**Solución:** restringir por variable de entorno.

```js
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8080'
}))
```

---

## Validación de env vars al arrancar

**Problema actual:** si `EXTERNAL_API_KEY` no está seteada, la app arranca con
el valor hardcodeado del fallback y falla silenciosamente en runtime.

**Solución:** validar variables críticas en `config/index.js` antes de que
Express levante, con un mensaje de error claro.

```js
const REQUIRED = ['EXTERNAL_API_KEY']

REQUIRED.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[config] Variable de entorno requerida no definida: ${key}`)
    process.exit(1)
  }
})
```

---

## Paginación en FilesTable

**Problema actual:** si el API externo devuelve muchos archivos con muchas líneas,
la tabla renderiza todas las filas sin límite, lo que degrada la performance del browser.

**Solución:** paginación client-side con React Bootstrap `Pagination`.

```jsx
const PAGE_SIZE = 50
const [page, setPage] = useState(1)
const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
```

En un sistema con miles de registros, la paginación debería moverse al backend
(`GET /files/data?page=1&limit=50`) para no transferir datos innecesarios.

---

## Nginx como reverse proxy en Docker

**Problema actual:** el frontend está buildeado con `API_URL=http://localhost:3000`,
lo que funciona en desarrollo local pero falla en deploys remotos donde el usuario
no tiene acceso directo al puerto de la API.

**Solución:** configurar nginx para hacer proxy de `/api/` al servicio interno,
de modo que el browser solo habla con el puerto 8080.

```nginx
location /api/ {
  proxy_pass http://api:3000/;
}
```

```js
// API_URL pasa a ser relativo
const API_BASE = '/api'
```

**Beneficio:** un solo puerto expuesto, sin CORS, funciona en cualquier entorno.

---

## Escalabilidad horizontal

Si el sistema necesita escalar a múltiples instancias:

| Componente | Estrategia |
|------------|------------|
| **API** | Stateless por diseño → escala con múltiples instancias detrás de un load balancer |
| **Caché** | Migrar `node-cache` a **Redis** compartido entre instancias |
| **Rate limiting** | Migrar a rate limiter con store Redis (`rate-limit-redis`) |
| **Frontend** | Build estático → CDN (CloudFront, Cloudflare Pages) |
| **CI/CD** | Agregar stage de deploy automático tras merge a `main` |

---

## Observabilidad

En producción se agregaría:

- **Structured logging** con `pino` o `winston` (JSON, nivel configurable por env)
- **Health check enriquecido** que verifique conectividad al API externo
- **Métricas** con `prom-client` expuestas en `/metrics` para Prometheus
- **Trazabilidad** con `request-id` header en cada respuesta para correlacionar logs
