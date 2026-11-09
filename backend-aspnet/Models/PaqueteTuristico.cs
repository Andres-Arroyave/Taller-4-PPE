namespace BackendAspnet.Models;

/// <summary>
/// Entidad que representa un paquete turístico en la base de datos SQLite.
/// Corresponde exactamente al modelo 'PaqueteTuristico' del schema de Prisma del Taller #1.
/// </summary>
public class PaqueteTuristico
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Nombre { get; set; } = string.Empty;
    public string Imagen { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public double Precio { get; set; }
    public int DuracionDias { get; set; }
    public int CuposDisponibles { get; set; }
    public bool Estado { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
