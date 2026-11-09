// Script de seed para poblar la base de datos con paquetes turísticos de prueba
// Ejecutar con: node seed.js  (con el backend corriendo en localhost:3000)

const API_URL = 'http://localhost:3000';

const paquetes = [
  {
    nombre: "Aventura Extrema en Cancún",
    imagen: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800",
    descripcion: "Disfruta de las playas paradisíacas de Cancún con snorkel, buceo y tour por ruinas mayas. Incluye hotel 5 estrellas, desayunos y traslados.",
    destino: "Cancún, México",
    precio: 1200,
    duracionDias: 7,
    cuposDisponibles: 15
  },
  {
    nombre: "Magia en París",
    imagen: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    descripcion: "Recorre la Ciudad Luz: Torre Eiffel, Louvre, Versalles y los mejores restaurantes. Hotel boutique en el centro de París.",
    destino: "París, Francia",
    precio: 2800,
    duracionDias: 10,
    cuposDisponibles: 8
  },
  {
    nombre: "Safari en Kenia",
    imagen: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    descripcion: "Vive la experiencia única de ver leones, elefantes y jirafas en su hábitat natural. Lodge de lujo en el Masai Mara.",
    destino: "Nairobi, Kenia",
    precio: 3500,
    duracionDias: 12,
    cuposDisponibles: 6
  },
  {
    nombre: "Tokio Moderno y Tradicional",
    imagen: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    descripcion: "Explora la mezcla perfecta entre tecnología y tradición japonesa. Templos, sushi auténtico, Akihabara y Monte Fuji.",
    destino: "Tokio, Japón",
    precio: 3200,
    duracionDias: 14,
    cuposDisponibles: 10
  },
  {
    nombre: "Cartagena Colonial",
    imagen: "https://images.unsplash.com/photo-1583007537897-27e77f6a2766?w=800",
    descripcion: "Descubre la magia de la ciudad amurallada. Paseos en chiva, playas del Rosario, gastronomía caribeña y vida nocturna.",
    destino: "Cartagena, Colombia",
    precio: 650,
    duracionDias: 5,
    cuposDisponibles: 20
  },
  {
    nombre: "Nueva York City Tour",
    imagen: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    descripcion: "La Gran Manzana te espera: Times Square, Central Park, Estatua de la Libertad, Broadway y los mejores museos del mundo.",
    destino: "Nueva York, USA",
    precio: 2200,
    duracionDias: 8,
    cuposDisponibles: 12
  },
  {
    nombre: "Santorini Romántico",
    imagen: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    descripcion: "Las icónicas casas blancas y azules del Egeo. Atardeceres en Oia, catas de vino volcánico y crucero por las islas griegas.",
    destino: "Santorini, Grecia",
    precio: 2600,
    duracionDias: 9,
    cuposDisponibles: 4
  },
  {
    nombre: "Medellín Ciudad de la Eterna Primavera",
    imagen: "https://images.unsplash.com/photo-1626168011011-5c8e4a3cbe2b?w=800",
    descripcion: "Conoce la transformación de Medellín: Metro Cable, Parque Arví, gastronomía local, Guatapé y el famoso Peñol.",
    destino: "Medellín, Colombia",
    precio: 480,
    duracionDias: 4,
    cuposDisponibles: 25
  },
  {
    nombre: "Machu Picchu Misterioso",
    imagen: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
    descripcion: "Camino Inca hacia la ciudad perdida de los Incas. Trek de 4 días, guías especializados, Cusco colonial y Valle Sagrado.",
    destino: "Cusco, Perú",
    precio: 1800,
    duracionDias: 8,
    cuposDisponibles: 10
  },
  {
    nombre: "Bali Isla de los Dioses",
    imagen: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
    descripcion: "Templos sagrados, arrozales de Tegallalang, surf en Kuta, yoga en Ubud y spa de lujo. Una experiencia espiritual única.",
    destino: "Bali, Indonesia",
    precio: 1950,
    duracionDias: 11,
    cuposDisponibles: 7
  }
];

async function seed() {
  console.log('🌱 Iniciando seed de paquetes turísticos...\n');

  // Paso 1: Registrar usuario admin para poder crear paquetes (requiere JWT)
  let token = '';
  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@agencia.com',
        nombre: 'Admin Agencia',
        password: 'admin123'
      })
    });
    const regData = await regRes.json();
    if (regData.accessToken) {
      token = regData.accessToken;
      console.log('✅ Usuario admin creado: admin@agencia.com / admin123');
    } else {
      // Si ya existe, hacemos login
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@agencia.com', password: 'admin123' })
      });
      const loginData = await loginRes.json();
      token = loginData.accessToken;
      console.log('✅ Login con usuario admin existente');
    }
  } catch (err) {
    console.error('❌ Error de autenticación:', err.message);
    return;
  }

  // Paso 2: Crear cada paquete turístico
  console.log('\n📦 Creando paquetes turísticos...\n');
  let creados = 0;

  for (const paquete of paquetes) {
    try {
      const res = await fetch(`${API_URL}/paquetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paquete)
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log(`  ✅ ${paquete.nombre} — $${paquete.precio} USD`);
        creados++;
      } else {
        console.log(`  ❌ Error en ${paquete.nombre}:`, data);
      }
    } catch (err) {
      console.log(`  ❌ Error en ${paquete.nombre}:`, err.message);
    }
  }

  console.log(`\n🎉 Seed completado: ${creados}/${paquetes.length} paquetes creados`);
  console.log('👉 Abre http://localhost:5173 para verlos en el catálogo');
  console.log('🔑 Admin: admin@agencia.com / admin123');
}

seed();
