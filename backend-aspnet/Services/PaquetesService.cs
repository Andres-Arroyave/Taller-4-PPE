using Microsoft.EntityFrameworkCore;
using BackendAspnet.Data;
using BackendAspnet.DTOs;
using BackendAspnet.Models;

namespace BackendAspnet.Services;

/// <summary>
/// Servicio de paquetes turísticos registrado por inyección de dependencias.
/// Equivale a PaquetesService del Taller #1 con la misma lógica de negocio.
/// </summary>
public class PaquetesService
{
    private readonly AppDbContext _db;

    // Inyección de dependencias: ASP.NET Core entrega AppDbContext automáticamente
    public PaquetesService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Crea un nuevo paquete turístico en SQLite.
    /// Equivale al método create() de PaquetesService en NestJS.
    /// </summary>
    public async Task<PaqueteTuristico> CreateAsync(CreatePaqueteDto dto)
    {
        var paquete = new PaqueteTuristico
        {
            Id = Guid.NewGuid().ToString(),
            Nombre = dto.Nombre,
            Imagen = dto.Imagen,
            Descripcion = dto.Descripcion,
            Destino = dto.Destino,
            Precio = dto.Precio,
            DuracionDias = dto.DuracionDias,
            CuposDisponibles = dto.CuposDisponibles,
            Estado = dto.Estado ?? true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.PaquetesTuristicos.Add(paquete);
        await _db.SaveChangesAsync();
        return paquete;
    }

    /// <summary>
    /// Consulta la lista de paquetes con paginación y búsqueda por nombre.
    /// Equivale al método findAll() de PaquetesService en NestJS (Reqs. #5 y #6).
    /// </summary>
    public async Task<PaginatedResponse<PaqueteTuristico>> FindAllAsync(PaginationQueryDto query)
    {
        var page = query.Page;
        var limit = query.Limit;
        var skip = (page - 1) * limit;

        // Construimos la consulta base con filtro de búsqueda por nombre
        var baseQuery = _db.PaquetesTuristicos.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();
            // Búsqueda insensible a mayúsculas por nombre (equivale a contains de Prisma)
            baseQuery = baseQuery.Where(p => p.Nombre.ToLower().Contains(search));
        }

        // Ejecutamos en paralelo el conteo total y la consulta paginada
        var total = await baseQuery.CountAsync();
        var data = await baseQuery
            .OrderByDescending(p => p.CreatedAt)  // Orden del más reciente al más antiguo
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)total / limit);

        return new PaginatedResponse<PaqueteTuristico>
        {
            Data = data,
            Meta = new PaginationMeta
            {
                Total = total,
                Page = page,
                Limit = limit,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPrevPage = page > 1
            }
        };
    }

    /// <summary>
    /// Busca un paquete por su ID único.
    /// Equivale al método findOne() de PaquetesService en NestJS.
    /// </summary>
    public async Task<PaqueteTuristico?> FindOneAsync(string id)
    {
        return await _db.PaquetesTuristicos.FindAsync(id);
    }

    /// <summary>
    /// Actualiza parcialmente un paquete (PATCH).
    /// Equivale al método update() de PaquetesService en NestJS.
    /// </summary>
    public async Task<PaqueteTuristico?> UpdateAsync(string id, UpdatePaqueteDto dto)
    {
        var paquete = await _db.PaquetesTuristicos.FindAsync(id);
        if (paquete == null) return null;

        // Aplicamos solo los campos que vienen en el DTO (actualización parcial)
        if (dto.Nombre != null) paquete.Nombre = dto.Nombre;
        if (dto.Imagen != null) paquete.Imagen = dto.Imagen;
        if (dto.Descripcion != null) paquete.Descripcion = dto.Descripcion;
        if (dto.Destino != null) paquete.Destino = dto.Destino;
        if (dto.Precio.HasValue) paquete.Precio = dto.Precio.Value;
        if (dto.DuracionDias.HasValue) paquete.DuracionDias = dto.DuracionDias.Value;
        if (dto.CuposDisponibles.HasValue) paquete.CuposDisponibles = dto.CuposDisponibles.Value;
        if (dto.Estado.HasValue) paquete.Estado = dto.Estado.Value;

        paquete.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return paquete;
    }

    /// <summary>
    /// Elimina un paquete turístico de la base de datos.
    /// Equivale al método remove() de PaquetesService en NestJS.
    /// </summary>
    public async Task<PaqueteTuristico?> RemoveAsync(string id)
    {
        var paquete = await _db.PaquetesTuristicos.FindAsync(id);
        if (paquete == null) return null;

        _db.PaquetesTuristicos.Remove(paquete);
        await _db.SaveChangesAsync();
        return paquete;
    }
}
