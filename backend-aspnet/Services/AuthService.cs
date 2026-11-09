using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendAspnet.Data;
using BackendAspnet.DTOs;
using BackendAspnet.Models;
using BCrypt.Net;

namespace BackendAspnet.Services;

/// <summary>
/// Servicio de autenticación registrado por inyección de dependencias.
/// Equivale a AuthService + UsersService del Taller #1 con la misma lógica.
/// </summary>
public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    // Inyección de dependencias: AppDbContext e IConfiguration entregados por ASP.NET Core
    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// Registra un nuevo usuario en la base de datos con contraseña hasheada.
    /// Equivale al método register() de AuthService en NestJS.
    /// </summary>
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Verificamos si ya existe un usuario con el mismo correo (equivale a ConflictException)
        var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("El correo electrónico ya está registrado");
        }

        // Encriptamos la contraseña con BCrypt (equivale a bcrypt.hash con 10 rounds)
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password, 10);

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = dto.Email,
            Nombre = dto.Nombre,
            Password = hashedPassword,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateToken(user);
        var userResponse = MapToUserResponse(user);

        return new AuthResponseDto
        {
            Message = "Usuario registrado exitosamente",
            User = userResponse,
            AccessToken = token
        };
    }

    /// <summary>
    /// Autentica un usuario existente y emite un JWT firmado.
    /// Equivale al método login() de AuthService en NestJS.
    /// </summary>
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // Buscamos el usuario por correo electrónico
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        // Si no existe el usuario lanzamos 401 (equivale a UnauthorizedException de NestJS)
        if (user == null)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        // Comparamos la contraseña enviada contra el hash guardado con BCrypt
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        var token = GenerateToken(user);
        var userResponse = MapToUserResponse(user);

        return new AuthResponseDto
        {
            Message = "Inicio de sesión exitoso",
            User = userResponse,
            AccessToken = token
        };
    }

    /// <summary>
    /// Genera un token JWT firmado con el ID, email y nombre del usuario.
    /// Equivale al método generateToken() privado de AuthService en NestJS.
    /// El payload es idéntico: { sub, email, nombre }.
    /// </summary>
    private string GenerateToken(User user)
    {
        var jwtSecret = _config["JWT_SECRET"]
            ?? throw new InvalidOperationException("Configura JWT_SECRET antes de generar tokens.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Claims idénticos al payload de NestJS: sub = userId, email, nombre
        var claims = new[]
        {
            new Claim("sub", user.Id),
            new Claim("email", user.Email),
            new Claim("nombre", user.Nombre)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1), // Expira en 1 día (igual que NestJS: '1d')
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Mapea un User a UserResponseDto (omite la contraseña por seguridad).
    /// Equivale a { password, ...userWithoutPassword } de NestJS.
    /// </summary>
    private static UserResponseDto MapToUserResponse(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Nombre = user.Nombre,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt
    };
}
