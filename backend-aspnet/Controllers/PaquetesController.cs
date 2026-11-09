using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackendAspnet.DTOs;
using BackendAspnet.Services;

namespace BackendAspnet.Controllers;

/// <summary>
/// Controlador de paquetes turísticos con los mismos endpoints que NestJS del Taller #1.
/// Rutas públicas: GET /paquetes y GET /paquetes/:id
/// Rutas protegidas con JWT: POST, PATCH, DELETE /paquetes
/// </summary>
[ApiController]
[Route("paquetes")]
public class PaquetesController : ControllerBase
{
    // Inyección de dependencias: ASP.NET Core entrega PaquetesService automáticamente
    private readonly PaquetesService _paquetesService;

    public PaquetesController(PaquetesService paquetesService)
    {
        _paquetesService = paquetesService;
    }

    // ─── ENDPOINTS DE LECTURA (PÚBLICOS) ──────────────────────────────────────

    /// <summary>
    /// GET /paquetes?page=1&amp;limit=10&amp;search=Cancún
    /// Retorna la lista paginada de paquetes. Mismo contrato JSON que NestJS.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> FindAll([FromQuery] PaginationQueryDto query)
    {
        var result = await _paquetesService.FindAllAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// GET /paquetes/:id
    /// Retorna un paquete por su ID único.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var paquete = await _paquetesService.FindOneAsync(id);
        if (paquete == null)
            return NotFound(new { message = $"Paquete turístico con ID \"{id}\" no encontrado" });

        return Ok(paquete);
    }

    // ─── ENDPOINTS DE ESCRITURA (PROTEGIDOS CON JWT) ──────────────────────────

    /// <summary>
    /// POST /paquetes
    /// Crea un nuevo paquete. Requiere token JWT en el header Authorization: Bearer {token}
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaqueteDto dto)
    {
        var paquete = await _paquetesService.CreateAsync(dto);
        return StatusCode(201, paquete);
    }

    /// <summary>
    /// PATCH /paquetes/:id
    /// Actualiza parcialmente un paquete. Requiere token JWT.
    /// </summary>
    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdatePaqueteDto dto)
    {
        var paquete = await _paquetesService.UpdateAsync(id, dto);
        if (paquete == null)
            return NotFound(new { message = $"Paquete turístico con ID \"{id}\" no encontrado" });

        return Ok(paquete);
    }

    /// <summary>
    /// DELETE /paquetes/:id
    /// Elimina un paquete. Requiere token JWT.
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(string id)
    {
        var paquete = await _paquetesService.RemoveAsync(id);
        if (paquete == null)
            return NotFound(new { message = $"Paquete turístico con ID \"{id}\" no encontrado" });

        return Ok(paquete);
    }
}
