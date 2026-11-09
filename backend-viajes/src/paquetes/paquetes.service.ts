// Importamos Injectable y NotFoundException (error 404) de NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
// Importamos el servicio de Prisma para consultar SQLite
import { PrismaService } from '../prisma/prisma.service.js';
// Importamos los DTOs de creación, actualización y paginación
import { CreatePaqueteDto } from './dto/create-paquete.dto.js';
import { UpdatePaqueteDto } from './dto/update-paquete.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';

// El decorador @Injectable marca la clase para que NestJS administre su ciclo de vida e inyección
@Injectable()
export class PaquetesService {
  // Inyección de dependencias: NestJS entrega una instancia de PrismaService en 'this.prisma'
  constructor(private readonly prisma: PrismaService) {}

  // Método para crear un nuevo paquete turístico en SQLite
  async create(createPaqueteDto: CreatePaqueteDto) {
    // Ejecuta la consulta 'create' de Prisma insertando el objeto validado por CreatePaqueteDto
    return this.prisma.paqueteTuristico.create({
      data: createPaqueteDto,
    });
  }

  // Método para consultar la lista de paquetes con soporte de paginación y búsqueda por nombre (Requerimiento #5 y #6)
  async findAll(query: PaginationQueryDto) {
    // Aseguramos que 'page' sea un número válido (mínimo 1)
    const page = Number(query.page) || 1;
    // Aseguramos que 'limit' sea un número válido (mínimo 10 por defecto)
    const limit = Number(query.limit) || 10;
    // Aplicamos la fórmula matemática de paginación: skip = (página - 1) * límite
    const skip = (page - 1) * limit;

    // Si el usuario envió un término de búsqueda, construimos el filtro de filtro 'contains' por nombre
    const where = query.search
      ? {
          nombre: {
            contains: query.search, // Filtra buscando coincidencias parciales en la columna nombre
          },
        }
      : {}; // Si no hay término de búsqueda, el filtro 'where' queda vacío (trae todos)

    // Ejecutamos en paralelo dos consultas a SQLite usando Promise.all para máxima velocidad
    const [total, data] = await Promise.all([
      // Consulta 1: Cuenta el total exacto de registros que cumplen con el filtro 'where'
      this.prisma.paqueteTuristico.count({ where }),
      // Consulta 2: Obtiene el bloque de registros correspondiente a la página actual
      this.prisma.paqueteTuristico.findMany({
        where,                        // Aplicamos el filtro de búsqueda por nombre
        skip,                         // Omitimos los registros de las páginas anteriores
        take: limit,                  // Tomamos únicamente la cantidad definida por 'limit'
        orderBy: { createdAt: 'desc' },// Ordenamos del más reciente al más antiguo
      }),
    ]);

    // Calculamos el número total de páginas dividiendo el total entre el límite y redondeando hacia arriba
    const totalPages = Math.ceil(total / limit);

    // Retornamos la respuesta estructurada con los datos de la página y la metadata de paginación
    return {
      data, // Lista con los 10 paquetes de la página actual
      meta: {
        total,         // Cantidad total de paquetes hallados (ej: 60)
        page,          // Número de la página actual (ej: 1)
        limit,         // Límite de paquetes por página (ej: 10)
        totalPages,    // Cantidad total de páginas navegables (ej: 6)
        hasNextPage: page < totalPages, // Booleano true si hay página siguiente
        hasPrevPage: page > 1,          // Booleano true si hay página anterior
      },
    };
  }

  // Método para buscar un único paquete por su id
  async findOne(id: string) {
    // Ejecuta 'findUnique' en Prisma filtrando por la clave primaria id
    const paquete = await this.prisma.paqueteTuristico.findUnique({
      where: { id },
    });

    // Si no se encontró ningún registro con ese ID, lanzamos un error HTTP 404 NotFoundException
    if (!paquete) {
      throw new NotFoundException(`Paquete turístico con ID "${id}" no encontrado`);
    }

    // Retornamos el paquete hallado
    return paquete;
  }

  // Método para actualizar un paquete existente
  async update(id: string, updatePaqueteDto: UpdatePaqueteDto) {
    // Verificamos primero que el paquete exista; si no existe, findOne lanza automáticamente un 404
    await this.findOne(id);
    // Ejecutamos 'update' en Prisma modificando únicamente los campos recibidos en el DTO
    return this.prisma.paqueteTuristico.update({
      where: { id },
      data: updatePaqueteDto,
    });
  }

  // Método para eliminar un paquete por su id
  async remove(id: string) {
    // Verificamos previamente la existencia del paquete
    await this.findOne(id);
    // Ejecutamos la sentencia 'delete' de Prisma eliminando el registro de SQLite
    return this.prisma.paqueteTuristico.delete({
      where: { id },
    });
  }
}
