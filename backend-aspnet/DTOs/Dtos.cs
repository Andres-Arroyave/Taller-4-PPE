using System.ComponentModel.DataAnnotations;

namespace BackendAspnet.DTOs;

// ============================================================
// DTOs DE PAQUETES TURÍSTICOS
// ============================================================

/// <summary>
/// DTO para crear un nuevo paquete turístico.
/// Equivale a CreatePaqueteDto del Taller #1 con las mismas validaciones.
/// </summary>
public class CreatePaqueteDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "La imagen es obligatoria")]
    public string Imagen { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción es obligatoria")]
    public string Descripcion { get; set; } = string.Empty;

    [Required(ErrorMessage = "El destino es obligatorio")]
    public string Destino { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor o igual a 0")]
    public double Precio { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La duración debe ser al menos 1 día")]
    public int DuracionDias { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Los cupos deben ser mayor o igual a 0")]
    public int CuposDisponibles { get; set; }

    public bool? Estado { get; set; }
}

/// <summary>
/// DTO para actualizar parcialmente un paquete turístico (PATCH).
/// Equivale a UpdatePaqueteDto del Taller #1 con todos los campos opcionales.
/// </summary>
public class UpdatePaqueteDto
{
    public string? Nombre { get; set; }
    public string? Imagen { get; set; }
    public string? Descripcion { get; set; }
    public string? Destino { get; set; }

    [Range(0, double.MaxValue)]
    public double? Precio { get; set; }

    [Range(1, int.MaxValue)]
    public int? DuracionDias { get; set; }

    [Range(0, int.MaxValue)]
    public int? CuposDisponibles { get; set; }

    public bool? Estado { get; set; }
}

/// <summary>
/// DTO para los parámetros de paginación y búsqueda.
/// Equivale a PaginationQueryDto del Taller #1.
/// </summary>
public class PaginationQueryDto
{
    public string? Search { get; set; }

    private int _page = 1;
    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    private int _limit = 10;
    public int Limit
    {
        get => _limit;
        set => _limit = value < 1 ? 1 : value;
    }
}

/// <summary>
/// Respuesta paginada que coincide exactamente con la estructura JSON
/// que retorna el backend de NestJS del Taller #1.
/// </summary>
public class PaginatedResponse<T>
{
    public IEnumerable<T> Data { get; set; } = [];
    public PaginationMeta Meta { get; set; } = new();
}

public class PaginationMeta
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPrevPage { get; set; }
}

// ============================================================
// DTOs DE AUTENTICACIÓN
// ============================================================

/// <summary>
/// DTO para el registro de un nuevo usuario.
/// Equivale a RegisterDto del Taller #1.
/// </summary>
public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// DTO para el inicio de sesión.
/// Equivale a LoginDto del Taller #1.
/// </summary>
public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Respuesta del usuario sin contraseña (para seguridad).
/// </summary>
public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Respuesta de autenticación con token JWT.
/// Coincide exactamente con la respuesta JSON de NestJS del Taller #1.
/// </summary>
public class AuthResponseDto
{
    public string Message { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = new();
    public string AccessToken { get; set; } = string.Empty;
}
