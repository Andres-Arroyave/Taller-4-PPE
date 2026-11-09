using BackendAspnet.Data;
using BackendAspnet.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAspnet.Services;

/// <summary>
/// Siembra datos de prueba automáticamente al arrancar el servidor
/// si la base de datos está vacía. Crea 20 paquetes turísticos de ejemplo.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Solo sembrar si no hay paquetes
        if (await db.PaquetesTuristicos.AnyAsync()) return;

        var paquetes = new List<PaqueteTuristico>
        {
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Aventura Extrema en Cancún",
                Imagen = "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800",
                Descripcion = "Disfruta las playas paradisíacas con snorkel, buceo y tour por ruinas mayas. Hotel 5 estrellas, desayunos y traslados incluidos.",
                Destino = "Cancún, México",
                Precio = 1200, DuracionDias = 7, CuposDisponibles = 15,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Magia en París",
                Imagen = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
                Descripcion = "Torre Eiffel, Louvre, Versalles y los mejores restaurantes. Hotel boutique en el corazón de la Ciudad Luz.",
                Destino = "París, Francia",
                Precio = 2800, DuracionDias = 10, CuposDisponibles = 8,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Safari en Kenia",
                Imagen = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
                Descripcion = "Vive la experiencia de ver leones, elefantes y jirafas en libertad. Lodge de lujo en el Masai Mara.",
                Destino = "Nairobi, Kenia",
                Precio = 3500, DuracionDias = 12, CuposDisponibles = 6,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Tokio Moderno y Tradicional",
                Imagen = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
                Descripcion = "Templos, sushi auténtico, Akihabara, Monte Fuji y la mezcla perfecta de tradición y tecnología japonesa.",
                Destino = "Tokio, Japón",
                Precio = 3200, DuracionDias = 14, CuposDisponibles = 10,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Cartagena Colonial",
                Imagen = "https://images.unsplash.com/photo-1583007537897-27e77f6a2766?w=800",
                Descripcion = "Paseos en chiva, playas del Rosario, gastronomía caribeña y la magia de la ciudad amurallada.",
                Destino = "Cartagena, Colombia",
                Precio = 650, DuracionDias = 5, CuposDisponibles = 20,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Nueva York City Tour",
                Imagen = "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
                Descripcion = "Times Square, Central Park, Estatua de la Libertad, Broadway y los mejores museos del mundo.",
                Destino = "Nueva York, USA",
                Precio = 2200, DuracionDias = 8, CuposDisponibles = 12,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Santorini Romántico",
                Imagen = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
                Descripcion = "Casas blancas y azules del Egeo, atardeceres en Oia, catas de vino volcánico y crucero por las islas griegas.",
                Destino = "Santorini, Grecia",
                Precio = 2600, DuracionDias = 9, CuposDisponibles = 4,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Medellín Ciudad Eterna Primavera",
                Imagen = "https://images.unsplash.com/photo-1626168011011-5c8e4a3cbe2b?w=800",
                Descripcion = "Metro Cable, Parque Arví, gastronomía local, Guatapé y el famoso Peñol del Guatapé.",
                Destino = "Medellín, Colombia",
                Precio = 480, DuracionDias = 4, CuposDisponibles = 25,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Machu Picchu Misterioso",
                Imagen = "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
                Descripcion = "Camino Inca hacia la ciudad perdida de los Incas. Trek 4 días, Cusco colonial y Valle Sagrado.",
                Destino = "Cusco, Perú",
                Precio = 1800, DuracionDias = 8, CuposDisponibles = 10,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Bali Isla de los Dioses",
                Imagen = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
                Descripcion = "Templos sagrados, arrozales de Tegallalang, surf en Kuta, yoga en Ubud y spa de lujo.",
                Destino = "Bali, Indonesia",
                Precio = 1950, DuracionDias = 11, CuposDisponibles = 7,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Roma Eterna",
                Imagen = "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
                Descripcion = "Coliseo, Vaticano, Fontana di Trevi y la mejor pasta del mundo. Paseo histórico por dos milenios de civilización.",
                Destino = "Roma, Italia",
                Precio = 2100, DuracionDias = 9, CuposDisponibles = 14,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Dubai Lujo Árabe",
                Imagen = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
                Descripcion = "Burj Khalifa, desierto en 4x4, souks tradicionales y el lujo más extremo del Medio Oriente.",
                Destino = "Dubái, Emiratos Árabes",
                Precio = 3800, DuracionDias = 7, CuposDisponibles = 5,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Bogotá Cultural",
                Imagen = "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=800",
                Descripcion = "Candelaria, Monserrate, Museo del Oro, gastronomía gourmet y la vibrante vida nocturna de la capital.",
                Destino = "Bogotá, Colombia",
                Precio = 350, DuracionDias = 3, CuposDisponibles = 30,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Maldivas Paraíso Tropical",
                Imagen = "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
                Descripcion = "Villas sobre el agua, arrecifes de coral vírgenes, buceo con tiburones ballena y puesta de sol perfecta.",
                Destino = "Malé, Maldivas",
                Precio = 4500, DuracionDias = 8, CuposDisponibles = 3,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Buenos Aires Porteño",
                Imagen = "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800",
                Descripcion = "Tango en San Telmo, carne asada en La Boca, Palermo Soho, teatro Colón y el mejor vino Malbec.",
                Destino = "Buenos Aires, Argentina",
                Precio = 980, DuracionDias = 6, CuposDisponibles = 18,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Ámsterdam Canales y Tulipanes",
                Imagen = "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800",
                Descripcion = "Paseo en barco por los canales, Rijksmuseum, campos de tulipanes, bicicletas y la mejor cerveza artesanal.",
                Destino = "Ámsterdam, Países Bajos",
                Precio = 2400, DuracionDias = 7, CuposDisponibles = 11,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Punta Cana All Inclusive",
                Imagen = "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
                Descripcion = "Playas de arena blanca, resort todo incluido 5 estrellas, excursión a Isla Saona y actividades acuáticas.",
                Destino = "Punta Cana, República Dominicana",
                Precio = 1350, DuracionDias = 7, CuposDisponibles = 22,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Lisboa y Porto Encantadoras",
                Imagen = "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
                Descripcion = "Pasteles de Belém, tranvías históricos, Sintra, fado en vivo, vino del Duero y atardeceres únicos.",
                Destino = "Lisboa, Portugal",
                Precio = 1750, DuracionDias = 8, CuposDisponibles = 16,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Sydney y la Gran Barrera",
                Imagen = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
                Descripcion = "Ópera de Sydney, Bondi Beach, buceo en la Gran Barrera de Coral y encuentro con canguros y koalas.",
                Destino = "Sydney, Australia",
                Precio = 4200, DuracionDias = 15, CuposDisponibles = 6,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Nombre = "Egipto Faraónico",
                Imagen = "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800",
                Descripcion = "Pirámides de Guiza, Esfinge, crucero por el Nilo, Luxor, Valle de los Reyes y el Museo Egipcio.",
                Destino = "El Cairo, Egipto",
                Precio = 2300, DuracionDias = 10, CuposDisponibles = 9,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
        };

        await db.PaquetesTuristicos.AddRangeAsync(paquetes);
        await db.SaveChangesAsync();

        Console.WriteLine($"🌱 Seed completado: {paquetes.Count} paquetes turísticos creados automáticamente.");
    }
}
