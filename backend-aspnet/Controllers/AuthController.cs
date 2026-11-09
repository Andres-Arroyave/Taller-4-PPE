using Microsoft.AspNetCore.Mvc;
using BackendAspnet.DTOs;
using BackendAspnet.Services;

namespace BackendAspnet.Controllers;

/// <summary>
/// Controlador de autenticación con los mismos endpoints que NestJS del Taller #1.
/// POST /auth/register  → Registrar nuevo usuario
/// POST /auth/login     → Iniciar sesión y obtener JWT
/// </summary>
[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    // Inyección de dependencias: ASP.NET Core entrega AuthService automáticamente
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// POST /auth/register
    /// Registra un nuevo usuario. Retorna el usuario creado y un accessToken JWT.
    /// Mismo contrato JSON que NestJS del Taller #1.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            return StatusCode(201, result);
        }
        catch (InvalidOperationException ex)
        {
            // 409 Conflict: correo ya registrado (equivale a ConflictException de NestJS)
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// POST /auth/login
    /// Autentica un usuario y retorna accessToken JWT.
    /// Retorna HTTP 200 (igual que @HttpCode(HttpStatus.OK) de NestJS).
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            // 401 Unauthorized: credenciales inválidas (equivale a UnauthorizedException de NestJS)
            return Unauthorized(new { message = ex.Message });
        }
    }
}
