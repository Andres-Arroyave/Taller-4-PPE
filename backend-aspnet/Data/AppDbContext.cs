using Microsoft.EntityFrameworkCore;
using BackendAspnet.Models;

namespace BackendAspnet.Data;

/// <summary>
/// DbContext de Entity Framework Core para SQLite.
/// Equivale al PrismaService del Taller #1 con las mismas tablas.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tabla de paquetes turísticos (equivale a PaqueteTuristico en Prisma)
    public DbSet<PaqueteTuristico> PaquetesTuristicos { get; set; }

    // Tabla de usuarios (equivale a User en Prisma)
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla PaqueteTuristico
        modelBuilder.Entity<PaqueteTuristico>(entity =>
        {
            entity.ToTable("PaqueteTuristico");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever(); // UUID generado en la aplicación
            entity.Property(e => e.Estado).HasDefaultValue(true);
        });

        // Configuración de la tabla User
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever(); // UUID generado en la aplicación
            entity.HasIndex(e => e.Email).IsUnique(); // Email único
        });
    }
}
