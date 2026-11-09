namespace BackendAspnet.Models;

/// <summary>
/// Entidad que representa un usuario registrado en el sistema.
/// Corresponde al modelo 'User' del schema de Prisma del Taller #1.
/// </summary>
public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Email { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
