using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using BackendAspnet.Data;
using BackendAspnet.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── 1. BASE DE DATOS: Entity Framework Core + SQLite ────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=viajes.db"));

// ─── 2. INYECCIÓN DE DEPENDENCIAS: Servicios ─────────────────────────────────
builder.Services.AddScoped<PaquetesService>();
builder.Services.AddScoped<AuthService>();

// ─── 3. AUTENTICACIÓN JWT BEARER ─────────────────────────────────────────────
var jwtSecret = builder.Configuration["JWT_SECRET"]
    ?? throw new InvalidOperationException("Configura JWT_SECRET antes de iniciar la aplicación.");
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// ─── 4. CONTROLADORES + JSON camelCase ───────────────────────────────────────
// camelCase garantiza compatibilidad con el cliente Vue: accessToken, totalPages, etc.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var messages = context.ModelState.Values
                .SelectMany(value => value.Errors)
                .Select(error => string.IsNullOrWhiteSpace(error.ErrorMessage)
                    ? "El valor enviado no es válido."
                    : error.ErrorMessage)
                .Distinct();

            return new BadRequestObjectResult(new { message = string.Join("; ", messages) });
        };
    });

// ─── 5. CORS ─────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("VueClient", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:4173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ─── 6. OPENAPI NATIVO (Microsoft.AspNetCore.OpenApi) + SWAGGER ──────────────
// AddOpenApi() es el nuevo sistema nativo de .NET 9 (Microsoft.AspNetCore.OpenApi)
// AddSwaggerGen() agrega la UI interactiva con soporte de token JWT
builder.Services.AddOpenApi();                   // Req #13 — Microsoft.AspNetCore.OpenApi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Agencia de Viajes API",
        Version = "v1",
        Description = "API REST de paquetes turísticos — Proyecto Final (ASP.NET Core)"
    });

    // Soporte de token JWT en Swagger UI (Req #14)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token JWT aquí. Ejemplo: Bearer eyJhbGci..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ─── 7. MIGRAR LA BD Y SEMBRAR DATOS AL ARRANCAR ─────────────────────────────
// MigrateAsync() aplica migraciones pendientes (crea viajes.db si no existe).
// DataSeeder.SeedAsync() llena la BD con 20 paquetes si está vacía.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}
await DataSeeder.SeedAsync(app.Services);

// ─── 8. OPENAPI NATIVO + SWAGGER UI ──────────────────────────────────────────
app.MapOpenApi();           // Expone /openapi/v1.json (endpoint nativo de .NET 9)

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Agencia de Viajes API v1");
    options.RoutePrefix = "swagger";   // http://localhost:3000/swagger
});

// ─── 9. PIPELINE DE MIDDLEWARE ───────────────────────────────────────────────
app.UseCors("VueClient");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("🚀 Servidor ASP.NET Core escuchando en http://localhost:3000");
Console.WriteLine("📄 Swagger UI:  http://localhost:3000/swagger");
Console.WriteLine("📄 OpenAPI JSON: http://localhost:3000/openapi/v1.json");
await app.RunAsync("http://0.0.0.0:3000");
