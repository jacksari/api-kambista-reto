# Kambista API

API REST para autenticación, consulta de tipos de cambio y registro de transacciones de cambio.

El proyecto está construido con NestJS y TypeScript siguiendo una arquitectura por módulos y capas. La lógica de negocio permanece independiente de NestJS, MongoDB, JWT, bcrypt y del proveedor externo de tipo de cambio.

## Tecnologías

- Node.js 22
- NestJS 11
- TypeScript
- MongoDB y Mongoose
- JWT para autenticación
- bcrypt para contraseñas
- Swagger/OpenAPI
- Jest y Supertest
- `mongodb-memory-server` para pruebas E2E

## Requisitos

- Node.js `>=22 <23`
- npm
- Una instancia de MongoDB para ejecutar la aplicación

## Instalación

```bash
npm install
```

Copia las variables de ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

| Variable | Requerida | Valor predeterminado | Descripción |
|---|---:|---|---|
| `MONGODB_URI` | Sí | — | URI de conexión a MongoDB. |
| `JWT_SECRET` | Sí | — | Secreto utilizado para firmar y validar los JWT. |
| `PORT` | No | `3000` | Puerto HTTP de la aplicación. |
| `JWT_EXPIRES_IN_SECONDS` | No | `3600` | Duración del access token en segundos. |
| `CORS_ORIGINS` | No | `http://localhost:3001` | Orígenes permitidos, separados por comas. |
| `SUNAT_EXCHANGE_RATE_URL` | No | `https://api.apis.net.pe/v1/tipo-cambio-sunat` | Fuente externa del tipo de cambio. |

Ejemplo:

```dotenv
PORT=3000
MONGODB_URI=mongodb://jack:2sodC6biY2qL5FNy@ac-n4b0xzh-shard-00-00.wof3qiu.mongodb.net:27017,ac-n4b0xzh-shard-00-01.wof3qiu.mongodb.net:27017,ac-n4b0xzh-shard-00-02.wof3qiu.mongodb.net:27017/?ssl=true&replicaSet=atlas-fkjgbx-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN_SECONDS=3600
SUNAT_EXCHANGE_RATE_URL=https://api.apis.net.pe/v1/tipo-cambio-sunat
CORS_ORIGINS=http://localhost:3001
```

## Ejecución

Modo desarrollo:

```bash
npm run start:dev
```

Compilar y ejecutar producción:

```bash
npm run build
npm run start:prod
```

Todas las rutas tienen el prefijo:

```text
/v1
```

La documentación Swagger está disponible en:

```text
http://localhost:3000/v1/docs
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Inicia NestJS en modo watch. |
| `npm run build` | Compila el proyecto. |
| `npm run start:prod` | Ejecuta la compilación de producción. |
| `npm test` | Ejecuta los tests unitarios. |
| `npm run test:e2e` | Ejecuta los tests E2E. |
| `npm run test:cov` | Genera cobertura de los tests unitarios. |

## Arquitectura

El código está organizado por módulos de negocio:

```text
src/modules/
├── auth/
├── exchange-rates/
├── transactions/
└── shared/
```

Cada módulo utiliza tres capas:

```text
Infrastructure → Application → Domain
```

La dirección de las dependencias apunta hacia el centro. El dominio no conoce NestJS, MongoDB ni servicios externos.

### Domain

Contiene las reglas puras del negocio:

- Entidades.
- Value Objects.
- Enums.
- Servicios de dominio.
- Errores de dominio.

Ejemplos:

- `Email` normaliza y valida el correo.
- `Password` exige entre 8 y 72 caracteres.
- `Money` impide montos no finitos o menores o iguales a cero.
- `CurrencyExchangeService` decide qué tasa aplicar.

Esta capa no utiliza decoradores de NestJS ni accede a MongoDB.

### Application

Contiene los casos de uso y define los contratos que necesita para trabajar:

- `RegisterUserUseCase`
- `LoginUserUseCase`
- `GetProfileUseCase`
- `ListUsersUseCase`
- `RefreshExchangeRateUseCase`
- `GetCurrentExchangeRateUseCase`
- `CreateTransactionUseCase`
- `GetTransactionHistoryUseCase`

Los casos de uso reciben dependencias mediante interfaces o ports, por ejemplo:

```ts
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

### Infrastructure

Implementa los ports de Application y conecta el sistema con detalles técnicos:

- Controllers y DTO HTTP.
- Mongoose, schemas, repositories y mappers.
- JWT y bcrypt.
- Guards y decoradores.
- Scheduler.
- Proveedor externo de SUNAT.
- Caché en memoria.
- Configuración de módulos e inyección de dependencias.

### Shared

Contiene piezas reutilizables que no pertenecen exclusivamente a un módulo:

- `DomainError`
- `ApplicationError`
- `IdGenerator`
- `AppLogger`
- `UuidGenerator`
- Conexión a MongoDB
- Logging
- Configuración de entorno
- Filtro global de excepciones
- Middleware de logging HTTP

## Comunicación entre módulos

Transactions necesita el tipo de cambio actual, pero su capa Application no importa directamente el módulo Exchange Rates.

Transactions define su propio port:

```text
ExchangeRateReader
```

Infraestructura proporciona este adapter:

```text
CurrentExchangeRateAdapter
```

El adapter consume `GetCurrentExchangeRateUseCase` de Exchange Rates y entrega a Transactions únicamente las tasas necesarias:

```text
CreateTransactionUseCase
        ↓ depende de
ExchangeRateReader
        ↑ implementado por
CurrentExchangeRateAdapter
        ↓ consume
GetCurrentExchangeRateUseCase
```

De esta forma, el dominio y la aplicación de Transactions no conocen la implementación de Exchange Rates.

## Módulo Auth

Responsabilidades:

- Registrar usuarios.
- Autenticar credenciales.
- Emitir y validar JWT.
- Obtener el perfil autenticado.
- Listar usuarios para administradores.
- Proteger rutas según autenticación y rol.

Los correos se almacenan normalizados en minúsculas. Las contraseñas se almacenan mediante bcrypt con 12 rondas de salt. Los usuarios registrados por la API reciben el rol `user`.

Los roles disponibles son:

```text
user
admin
```

## Módulo Exchange Rates

Responsabilidades:

- Obtener el tipo de cambio externo.
- Validar la respuesta del proveedor.
- Persistir cada actualización en MongoDB.
- Mantener el último valor en caché en memoria.
- Entregar el tipo de cambio actual.

### Actualización automática

Cuando NestJS termina de iniciar, ejecuta:

```text
ExchangeRateScheduler.onApplicationBootstrap()
```

Esto dispara una actualización inmediata. Después, `@Interval(30_000)` vuelve a actualizar cada 30 segundos.

```text
Inicio de la aplicación
        ↓
Consulta al proveedor externo
        ↓
Validación de la respuesta
        ↓
Creación de ExchangeRate
        ↓
MongoDB + caché en memoria
```

### Lectura del tipo de cambio

La consulta utiliza esta prioridad:

```text
Caché en memoria
        ↓ si está vacía
Último registro de MongoDB
        ↓ si no existe
EXCHANGE_RATE_NOT_AVAILABLE (503)
```

Cuando se recupera un registro desde MongoDB, también se vuelve a llenar la caché.

La caché actual es local al proceso:

- Se pierde al reiniciar la aplicación.
- No se comparte entre múltiples instancias.
- Mantiene un único tipo de cambio actual.
- MongoDB funciona como respaldo persistente.

## Módulo Transactions

Responsabilidades:

- Crear transacciones de cambio.
- Aplicar el tipo de cambio correspondiente.
- Guardar la tasa exacta utilizada en cada transacción.
- Consultar historiales por usuario, fecha y paginación.

### Reglas de conversión

```text
USD → PEN
montoDestino = montoOrigen × tasaVenta

PEN → USD
montoDestino = montoOrigen ÷ tasaCompra
```


El resultado se redondea a dos decimales. No se permiten monedas iguales ni montos menores o iguales a cero.

## Autenticación

Las rutas protegidas requieren:

```http
Authorization: Bearer <access_token>
```

El JWT contiene:

- `sub`: ID del usuario.
- `email`: correo normalizado.
- `role`: rol del usuario.

## API

### Resumen de endpoints

| Método | Ruta | Autenticación | Rol | Descripción |
|---|---|---:|---|---|
| `POST` | `/v1/auth/register` | No | — | Registra un usuario y devuelve un JWT. |
| `POST` | `/v1/auth/login` | No | — | Autentica credenciales y devuelve un JWT. |
| `GET` | `/v1/auth/profile` | Sí | Cualquiera | Devuelve el perfil autenticado. |
| `GET` | `/v1/users` | Sí | `admin` | Lista usuarios con ID, nombre y correo. |
| `GET` | `/v1/exchange-rates/current` | Sí | Cualquiera | Devuelve el último tipo de cambio disponible. |
| `POST` | `/v1/transactions` | Sí | Cualquiera | Registra una operación de cambio. |
| `GET` | `/v1/transactions/history` | Sí | Cualquiera | Devuelve un historial paginado. |

### Registrar usuario

```http
POST /v1/auth/register
Content-Type: application/json
```

```json
{
  "nombre": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

Validaciones:

- `nombre`: texto entre 1 y 100 caracteres.
- `email`: formato de correo válido.
- `password`: texto entre 8 y 72 caracteres.
- El correo debe ser único.

Respuesta `201 Created`:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "7bcfe595-752a-4ec5-9900-a1846625068f",
    "nombre": "John Doe",
    "email": "john@example.com",
    "rol": "user"
  }
}
```

Si el correo ya existe, responde `409 Conflict` con `USER_ALREADY_EXISTS`.

### Iniciar sesión

```http
POST /v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

Respuesta `200 OK`:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "7bcfe595-752a-4ec5-9900-a1846625068f",
    "nombre": "John Doe",
    "email": "john@example.com",
    "rol": "user"
  }
}
```

Un correo inexistente y una contraseña incorrecta producen la misma respuesta `401 Unauthorized`:

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect"
}
```

La respuesta deliberadamente no revela cuál credencial fue incorrecta.

### Obtener perfil

```http
GET /v1/auth/profile
Authorization: Bearer <access_token>
```

Respuesta `200 OK`:

```json
{
  "id": "7bcfe595-752a-4ec5-9900-a1846625068f",
  "nombre": "John Doe",
  "email": "john@example.com",
  "rol": "user"
}
```

El ID se obtiene del JWT y el caso de uso consulta el usuario actual en MongoDB.

### Listar usuarios

Solo disponible para `admin`:

```http
GET /v1/users
Authorization: Bearer <admin_access_token>
```

Respuesta `200 OK`:

```json
{
  "usuarios": [
    {
      "id": "7bcfe595-752a-4ec5-9900-a1846625068f",
      "nombre": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

La consulta proyecta únicamente ID, nombre y correo; no devuelve hashes de contraseñas. Los resultados se ordenan por nombre.

### Obtener tipo de cambio actual

```http
GET /v1/exchange-rates/current
Authorization: Bearer <access_token>
```

Respuesta `200 OK`:

```json
{
  "id": "7bcfe595-752a-4ec5-9900-a1846625068f",
  "tipoDeCambioCompra": 3.72,
  "tipoDeCambioVenta": 3.78,
  "fuente": "SUNAT",
  "moneda": "USD",
  "fechaTipoDeCambio": "2026-10-02",
  "fechaCreacion": "2026-10-02T15:30:00.000Z"
}
```

Si no existe ningún valor en caché ni MongoDB, responde `503 Service Unavailable` con `EXCHANGE_RATE_NOT_AVAILABLE`.

### Crear transacción

```http
POST /v1/transactions
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "monedaOrigen": "USD",
  "monedaDestino": "PEN",
  "monto": 100
}
```

Validaciones:

- Las monedas permitidas son `USD` y `PEN`.
- Las monedas deben ser diferentes.
- `monto` debe estar entre `0.01` y `9999999.99`.
- El monto puede tener como máximo dos decimales.
- Debe existir un tipo de cambio disponible.

Respuesta `201 Created`:

```json
{
  "id": "6820c41b-6293-4abd-89ab-888013d61c76",
  "monedaOrigen": "USD",
  "monedaDestino": "PEN",
  "monto": 100,
  "montoCambiado": 378,
  "tipoCambio": 3.78,
  "fecha": "2026-10-02T16:59:54.149Z"
}
```

La transacción conserva `tipoCambio`, por lo que el valor histórico no cambia cuando se actualizan las tasas futuras.

### Consultar historial

```http
GET /v1/transactions/history?startDate=2026-10-01T00:00:00.000Z&endDate=2026-10-31T23:59:59.999Z&page=1&perPage=20
Authorization: Bearer <access_token>
```

Parámetros:

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `startDate` | ISO date-time | Sí | Inicio inclusivo del rango. |
| `endDate` | ISO date-time | Sí | Fin inclusivo del rango. |
| `page` | entero | Sí | Página, desde 1. |
| `perPage` | entero | Sí | Elementos por página, entre 1 y 100. |
| `userId` | UUID | No | Permite a un administrador consultar a otro usuario. |

Reglas de acceso:

- Un usuario normal siempre consulta su propio historial.
- Si un usuario normal envía `userId`, recibe `403 Forbidden`.
- Un administrador sin `userId` consulta su propio historial.
- Un administrador con `userId` consulta el historial solicitado.
- Un rango con `startDate > endDate` devuelve `400 Bad Request`.

Respuesta `200 OK`:

```json
{
  "data": [
    {
      "id": "6820c41b-6293-4abd-89ab-888013d61c76",
      "monedaOrigen": "USD",
      "monedaDestino": "PEN",
      "monto": 100,
      "montoCambiado": 378,
      "tipoCambio": 3.78,
      "fecha": "2026-10-02T16:59:54.149Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Los resultados se ordenan desde la transacción más reciente.

## Errores

El filtro global mantiene una estructura consistente:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message"
}
```

La traducción se realiza en el límite HTTP:

- `DomainError` → `400 Bad Request`.
- `ApplicationError` → estado definido por su categoría.
- `HttpException` de Nest → conserva su estado HTTP.
- Error inesperado → `500 Internal Server Error` sin exponer detalles internos.

Errores principales:

| Código | HTTP | Situación |
|---|---:|---|
| `INVALID_EMAIL` | 400 | Correo inválido. |
| `WEAK_PASSWORD` | 400 | Contraseña fuera del rango permitido. |
| `USER_ALREADY_EXISTS` | 409 | Correo ya registrado. |
| `INVALID_CREDENTIALS` | 401 | Usuario inexistente o contraseña incorrecta. |
| `USER_NOT_FOUND` | 404 | El usuario del token ya no existe. |
| `EXCHANGE_RATE_NOT_AVAILABLE` | 503 | No existe tipo de cambio en caché ni MongoDB. |
| `INVALID_AMOUNT` | 400 | Monto inválido. |
| `SAME_CURRENCY` | 400 | Moneda de origen y destino iguales. |
| `INVALID_DATE_RANGE` | 400 | Rango de fechas invertido. |
| `TRANSACTION_HISTORY_FORBIDDEN` | 403 | Usuario sin permiso para consultar otro historial. |

No se agregan `try/catch` indiscriminadamente en controllers o casos de uso. Los errores se propagan hasta el filtro global. Infraestructura captura errores cuando necesita traducir una falla técnica, como ocurre con el proveedor externo.

## Rate limiting

Existe una protección global de:

```text
100 solicitudes por minuto
```

El login reemplaza ese límite con una política más restrictiva:

```text
3 solicitudes durante 5 minutos
bloqueo durante 5 minutos
```

El tracker del login utiliza:

```text
correo normalizado + dirección IP
```

Las demás rutas utilizan el tracker predeterminado por IP. El almacenamiento predeterminado del throttler está en memoria, por lo que los contadores son locales a cada proceso.

## Logging

El proyecto registra dos clases de eventos:

### HTTP

`HttpLoggingMiddleware` registra al terminar cada petición:

- Usuario, cuando está autenticado.
- Método HTTP.
- Endpoint sin query string.
- Código de respuesta.
- Duración en milisegundos.

### Aplicación

Los casos de uso registran eventos relevantes mediante el port `AppLogger`:

- `user_registered`
- `user_authenticated`
- `exchange_rate_refreshed`
- `exchange_rate_retrieved_from_cache`
- `exchange_rate_retrieved_from_repository`
- `exchange_rate_not_available`
- `transaction_created`

La implementación actual utiliza el logger de NestJS y escribe en la salida estándar. No guarda los logs en MongoDB.

## Persistencia

MongoDB utiliza tres colecciones:

### `users`

- UUID como `_id`.
- Correo único e indexado.
- Hash de contraseña.
- Rol.
- Fechas de creación y actualización.

### `exchange_rates`

- Tasa de compra y venta.
- Fuente, moneda y fecha informada por el proveedor.
- Índice descendente por `createdAt` para recuperar el último valor.

### `transactions`

- Usuario propietario.
- Monedas de origen y destino.
- Montos de origen y resultado.
- Tasa aplicada.
- Fecha de creación.
- Índice compuesto por `userId` y `createdAt`.

Los mappers separan las entidades del dominio de los documentos de persistencia.

## Tests

### Tests unitarios

Ubicación:

```text
test/unit/auth/application/use-cases/
```

Prueban los casos de uso directamente, sin levantar NestJS, HTTP ni MongoDB.

Los mocks están en:

```text
test/unit/auth/mocks/auth-dependencies.mocks.ts
```

Dependencias simuladas:

- `UserRepository`
- `PasswordHasher`
- `IdGenerator`
- `AccessTokenService`
- `AppLogger`

Escenarios cubiertos:

- Registro exitoso.
- Normalización del correo y nombre.
- Hash de contraseña y emisión del token.
- Rechazo de correo existente.
- Login exitoso.
- Rechazo de usuario inexistente.
- Rechazo de contraseña incorrecta.
- Confirmación de que no se emite token después de un fallo.

Ejecución:

```bash
npm test
```

### Tests E2E

Ubicación:

```text
test/e2e/
├── auth/
│   └── auth.e2e-spec.ts
├── transactions/
│   ├── store-transaction.e2e-spec.ts
│   └── transaction-history.e2e-spec.ts
├── fakes/
│   └── exchange-rate-provider.fake.ts
└── support/
    ├── e2e-test-application.ts
    └── register-and-login.ts
```

Los E2E utilizan `app.getHttpServer()` y Supertest, por lo que recorren:

```text
HTTP
→ Controller
→ DTO y ValidationPipe
→ Guards
→ Caso de uso
→ Adapter/Repository
→ MongoDB temporal
→ Respuesta HTTP
```

Cada suite crea una instancia aislada mediante `MongoMemoryServer` y la elimina al finalizar. Los correos incluyen UUID para evitar colisiones.

El proveedor externo se reemplaza por un fake con tasas fijas:

```text
compra: 3.7
venta: 3.8
```

Esto mantiene los tests deterministas y evita fallos por falta de Internet, timeouts o respuestas `429` del servicio externo. La aplicación, los módulos, los repositories y MongoDB siguen siendo reales dentro del E2E.

Escenarios cubiertos:

- Registro exitoso.
- Correo duplicado.
- Login exitoso.
- Credenciales incorrectas.
- Creación de una transacción autenticada.
- Consulta del historial y verificación de la transacción creada.

Ejecución:

```bash
npm run test:e2e
```

## Estructura resumida

```text
src/
├── app.module.ts
├── main.ts
└── modules/
    ├── auth/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── exchange-rates/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── transactions/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    └── shared/
        ├── domain/
        ├── application/
        └── infrastructure/
```

## Decisiones de diseño

- El dominio protege sus propias invariantes.
- Application coordina los flujos y depende de contratos.
- Infrastructure implementa los detalles externos.
- Los controllers solo traducen HTTP hacia comandos o queries.
- Los DTO HTTP están separados de los modelos de Application.
- Los mappers separan persistencia y dominio.
- Los errores se traducen de forma centralizada.
- Transactions conserva la tasa aplicada para mantener integridad histórica.
- Las comunicaciones entre módulos se adaptan mediante ports.
- Los tests unitarios aíslan casos de uso; los E2E conservan la aplicación real y reemplazan únicamente el sistema externo.
