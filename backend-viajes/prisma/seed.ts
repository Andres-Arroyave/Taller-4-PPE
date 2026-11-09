import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const destinos = [
  { ciudad: 'Cancún', pais: 'México', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Punta Cana', pais: 'República Dominicana', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Machu Picchu', pais: 'Perú', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Cartagena', pais: 'Colombia', img: 'https://images.unsplash.com/photo-1583531172005-814191b8b6c0?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Rio de Janeiro', pais: 'Brasil', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Paris', pais: 'Francia', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Roma', pais: 'Italia', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Tokio', pais: 'Japón', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Nueva York', pais: 'Estados Unidos', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Santorini', pais: 'Grecia', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Dubái', pais: 'Emiratos Árabes Unidos', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Bali', pais: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Barcelona', pais: 'España', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'Ámsterdam', pais: 'Países Bajos', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80' },
  { ciudad: 'El Cairo', pais: 'Egipto', img: 'https://images.unsplash.com/photo-1572252821143-035a0048e652?auto=format&fit=crop&w=800&q=80' },
];

const tiposPaquetes = [
  'Aventura Extrema en',
  'Escapada Romántica a',
  'Tour Cultural por',
  'Vacaciones Familiares en',
  'Experiencia VIP en',
  'Ruta Gastronómica por',
  'Relax y Spa en',
  'Descubrimiento Mágico de',
];

async function main() {
  console.log('🌱 Eliminando datos anteriores...');
  await prisma.paqueteTuristico.deleteMany({});

  console.log('🌱 Generando 60 paquetes turísticos...');

  const paquetes = [];

  for (let i = 1; i <= 60; i++) {
    const destinoInfo = destinos[(i - 1) % destinos.length];
    const tipo = tiposPaquetes[(i - 1) % tiposPaquetes.length];
    
    paquetes.push({
      nombre: `${tipo} ${destinoInfo.ciudad} #${i}`,
      imagen: destinoInfo.img,
      descripcion: `Disfruta de un increíble paquete turístico en ${destinoInfo.ciudad}, ${destinoInfo.pais}. Incluye alojamiento, desayunos, visitas guiadas y traslados incluidos.`,
      destino: `${destinoInfo.ciudad}, ${destinoInfo.pais}`,
      precio: Math.floor(Math.random() * 2500) + 450,
      duracionDias: Math.floor(Math.random() * 10) + 3,
      cuposDisponibles: Math.floor(Math.random() * 25) + 5,
      estado: true,
    });
  }

  await prisma.paqueteTuristico.createMany({
    data: paquetes,
  });

  console.log('✅ ¡60 paquetes turísticos sembrados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

    
  });
