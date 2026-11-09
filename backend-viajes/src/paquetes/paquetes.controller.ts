/**
 * =========================================================================================
 * 🔄 FLUJO DE COMUNICACIÓN FRONTEND <-> BACKEND & INTERACCIÓN DEL DTO CON LA ENTIDAD
 * =========================================================================================
 * 
 * 1. PASO 1: El usuario en Vue (Frontend) hace clic en "Crear Paquete".
 * 2. PASO 2: Axios ([frontend-viajes/src/services/api.js]) envía una petición HTTP POST a "http://localhost:3000/paquetes"
 *            adjuntando el token JWT en el header: 'Authorization: Bearer <token>'
 * 3. PASO 3: NestJS intercepta la petición en este Controlador ([PaquetesController]).
 * 4. PASO 4: INTERACCIÓN DEL DTO:
 *            - El Pipe Global 'ValidationPipe' ([src/main.ts]) toma el JSON del cuerpo de la petición.
 *            - Lo mapea contra la clase 'CreatePaqueteDto' ([src/paquetes/dto/create-paquete.dto.ts]).
 *            - Evalúa las reglas (@IsString(), @IsNumber(), @Min(0)).
 *            - Si los datos son válidos, el DTO limpio y sanitizado es entregado al método del controlador.
 * 5. PASO 5: INYECCIÓN DE DEPENDENCIAS:
 *            - Este Controlador NO hace "new PaquetesService()".
 *            - NestJS inyectó automáticamente 'PaquetesService' a través del constructor.
 * 6. PASO 6: El Controlador invoca 'this.paquetesService.create(createPaqueteDto)'.
 * 7. PASO 7: 'PaquetesService' usa su propio servicio inyectado 'PrismaService' para insertar en la tabla SQLite.
 * 8. PASO 8: El resultado retorna en cascada al controlador y se envía como respuesta JSON al Frontend Vue.
 * =========================================================================================
 */

// Importamos los decoradores de verbos HTTP, parámetros y guards de NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
// Importamos el servicio que contiene la lógica de negocio de los paquetes
import { PaquetesService } from './paquetes.service.js';
// Importamos los DTOs de validación de datos
import { CreatePaqueteDto } from './dto/create-paquete.dto.js';
import { UpdatePaqueteDto } from './dto/update-paquete.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
// Importamos el Guard de autenticación JWT para proteger la escritura (Requerimiento #10)
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

// El decorador @Controller('paquetes') establece la ruta base de este recurso HTTP: http://localhost:3000/paquetes
@Controller('paquetes')
export class PaquetesController {
  // 💉 INYECCIÓN DE DEPENDENCIAS AQUÍ: NestJS crea y le entrega la instancia de PaquetesService al controlador
  constructor(private readonly paquetesService: PaquetesService) {}

  // --- ENDPOINTS DE LECTURA (PÚBLICOS - Accesibles por cualquier visitante) ---

  // Mapea peticiones GET a http://localhost:3000/paquetes (con query params ?page=1&search=Cancun)
  @Get()
  // @Query() extrae y valida los parámetros de la URL usando PaginationQueryDto
  findAll(@Query() query: PaginationQueryDto) {
    // Invoca la consulta del servicio retornando la lista paginada de paquetes
    return this.paquetesService.findAll(query);
  }

  // Mapea peticiones GET a http://localhost:3000/paquetes/:id (ej: /paquetes/uuid-123)
  @Get(':id')
  // @Param('id') extrae el parámetro dinámico de la URL
  findOne(@Param('id') id: string) {
    // Invoca la búsqueda por ID en el servicio
    return this.paquetesService.findOne(id);
  }

  // --- ENDPOINTS DE ESCRITURA (PROTEGIDOS CON JWT - Requerimiento #10) ---

  // Aplica el Guard de seguridad JWT: rechaza la petición con 401 si no viene el token en la cabecera
  @UseGuards(JwtAuthGuard)
  // Mapea peticiones POST a http://localhost:3000/paquetes para crear un nuevo paquete
  @Post()
  // @Body() extrae y valida el cuerpo de la petición mediante CreatePaqueteDto
  create(@Body() createPaqueteDto: CreatePaqueteDto) {
    // Delegamos la creación al servicio de paquetes
    return this.paquetesService.create(createPaqueteDto);
  }

  // Protege este endpoint exigiendo que el cliente esté autenticado con su token JWT
  @UseGuards(JwtAuthGuard)
  // Mapea peticiones PATCH a http://localhost:3000/paquetes/:id para actualizar un paquete
  @Patch(':id')
  // Extrae el ID de la URL y el cuerpo de datos modificado
  update(@Param('id') id: string, @Body() updatePaqueteDto: UpdatePaqueteDto) {
    // Delegamos la actualización parcial al servicio
    return this.paquetesService.update(id, updatePaqueteDto);
  }

  // Protege la eliminación de registros requiriendo autenticación JWT
  @UseGuards(JwtAuthGuard)
  // Mapea peticiones DELETE a http://localhost:3000/paquetes/:id para eliminar un paquete
  @Delete(':id')
  // Extrae el ID del registro a eliminar
  remove(@Param('id') id: string) {
    // Delegamos la eliminación del paquete al servicio
    return this.paquetesService.remove(id);
  }
}
