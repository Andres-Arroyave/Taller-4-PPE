# 🏖️ Agencia de Viajes — Backend ASP.NET Core

> **Proyecto Final** — Reemplazo del backend NestJS del Taller #1 por una **ASP.NET Core Web API** manteniendo el mismo contrato de API para que el cliente Vue funcione sin ningún cambio.

---

## 🏗️ Tecnologías

| Capa | Taller #1 (NestJS) | Proyecto Final (ASP.NET Core) |
|------|--------------------|-------------------------------|
| Framework | NestJS | ASP.NET Core 9 Web API |
| ORM | Prisma | Entity Framework Core 9 |
| Base de datos | SQLite | SQLite |
| Autenticación | passport-jwt | JwtBearer (Microsoft) |
| Hash contraseñas | bcrypt | BCrypt.Net-Next |
| Documentación | — | OpenAPI nativo + Swagger UI |

---

## 📋 Requerimientos implementados

### Sección 1 — Montaje del proyecto
- ✅ **Req 1** — Creado con `dotnet new webapi --use-controllers`
- ✅ **Req 2** — Modelo con **Entity Framework Core** y **SQLite** con migraciones automáticas
- ✅ **Req 3** — CRUD con `Controller`, servicio por **inyección de dependencias** y DTOs validados

### Sección 2 — Mismo contrato que la API de NestJS
- ✅ **Req 4** — Mismas rutas, verbos HTTP y códigos de estado (200, 201, 401, 404, 409)
- ✅ **Req 5** — JSON en camelCase idéntico (`accessToken`, `totalPages`, `hasNextPage`)
- ✅ **Req 6** — `?page=1&limit=10&search=Cancún` funciona igual que en NestJS
- ✅ **Req 7** — CORS configurado para `http://localhost:5173`

### Sección 3 — Autenticación JWT
- ✅ **Req 8** — `POST /auth/register` con BCrypt (10 rounds)
- ✅ **Req 9** — `POST /auth/login` emitiendo JWT con payload `{ sub, email, nombre }`
- ✅ **Req 10** — `[Authorize]` en POST, PATCH y DELETE de `/paquetes`

### Sección 4 — Integración con el cliente Vue
- ✅ **Req 11** — El `.env` del frontend **no se modifica** (ya apunta a `http://localhost:3000`)
- ✅ **Req 12** — CRUD, búsqueda, paginación y sesión funcionan contra la nueva API

### Bonificación — OpenAPI (+10%)
- ✅ **Req 13** — `AddOpenApi()` y `MapOpenApi()` de `Microsoft.AspNetCore.OpenApi` (nativo .NET 9)
- ✅ **Req 14** — Swagger UI interactivo en `/swagger` para probar endpoints con token JWT

---

## 🚀 Cómo ejecutar

### Requisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9) (`dotnet --list-sdks` para verificar)
- Una variable de entorno `JWT_SECRET` con una clave aleatoria de al menos 32 caracteres.

### Pasos

```bash
# 1. Ir a la carpeta del backend
cd backend-aspnet

# 2. Restaurar dependencias
dotnet restore

# 3. Configurar una clave JWT temporal en PowerShell (no la guardes en el repositorio)
$env:JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# 4. Iniciar el servidor
dotnet run
```

> ✅ Al arrancar, el servidor **automáticamente**:
> - Aplica las migraciones y crea `viajes.db`
> - Siembra **20 paquetes turísticos** de prueba si la BD está vacía
> - No hace falta correr `dotnet ef database update` manualmente
>
> La clave JWT se lee desde `JWT_SECRET`; si no está configurada, el servidor no inicia. La clave generada en el ejemplo es temporal y cambia al abrir una nueva terminal.

### URLs disponibles
| URL | Descripción |
|-----|-------------|
| `http://localhost:3000/paquetes` | API de paquetes |
| `http://localhost:3000/swagger` | Swagger UI interactivo |
| `http://localhost:3000/openapi/v1.json` | Documento OpenAPI nativo |

---

## 🌐 Conectar el frontend Vue

```bash
cd frontend-viajes
npm install
npm run dev
# → http://localhost:5173
```

> El cliente Vue funciona **sin ningún cambio de código** — solo necesita que el backend esté corriendo.

---

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/paquetes` | No | Lista paginada con búsqueda |
| `GET` | `/paquetes/:id` | No | Detalle de un paquete |
| `POST` | `/paquetes` | 🔒 JWT | Crear paquete |
| `PATCH` | `/paquetes/:id` | 🔒 JWT | Actualizar paquete |
| `DELETE` | `/paquetes/:id` | 🔒 JWT | Eliminar paquete |
| `POST` | `/auth/register` | No | Registrar usuario |
| `POST` | `/auth/login` | No | Iniciar sesión |

### Respuesta paginada (`GET /paquetes`)
```json
{
  "data": [ { "id": "...", "nombre": "...", "precio": 1200, ... } ],
  "meta": {
    "total": 20, "page": 1, "limit": 9,
    "totalPages": 3, "hasNextPage": true, "hasPrevPage": false
  }
}
```

---

## 🗂️ Estructura del proyecto

```
backend-aspnet/
├── Controllers/
│   ├── AuthController.cs         ← POST /auth/register y /auth/login
│   └── PaquetesController.cs     ← CRUD /paquetes
├── Data/
│   └── AppDbContext.cs           ← DbContext EF Core (SQLite)
├── DTOs/
│   └── Dtos.cs                   ← Validaciones de entrada y respuesta
├── Migrations/                   ← Generadas automáticamente por EF Core
├── Models/
│   ├── PaqueteTuristico.cs       ← Entidad de paquete turístico
│   └── User.cs                   ← Entidad de usuario
├── Services/
│   ├── AuthService.cs            ← Registro, login y JWT
│   ├── DataSeeder.cs             ← Siembra 20 paquetes al arrancar
│   └── PaquetesService.cs        ← CRUD y paginación
├── Program.cs                    ← Configuración completa del servidor
├── appsettings.json              ← Configuración general (sin secretos)
├── seed.js                       ← Script alternativo de seed (Node.js)
├── .gitignore                    ← Excluye bin/, obj/, *.db
└── README.md                     ← Este archivo
```
