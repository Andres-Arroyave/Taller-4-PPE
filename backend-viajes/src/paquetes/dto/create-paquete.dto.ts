/**
 * =========================================================================================
 * 🛡️ ¿CÓMO INTERACTÚA EL DTO CON LA ENTIDAD Y EL RESTO DEL SISTEMA?
 * =========================================================================================
 * 
 * 1. DEFINICIÓN: Este DTO (Data Transfer Object) es la capa de barrera entre el HTTP exterior y la Entidad.
 * 2. FLUJO DE INTERACCIÓN:
 *    - Petición Entrante: Llama al endpoint POST /paquetes enviando un JSON.
 *    - Filtro ValidationPipe ([src/main.ts]): Intercepta el JSON antes de que llegue a PaquetesController.
 *    - Evaluación de Decoradores: Comprueba cada una de las reglas declaradas abajo (@IsString, @Min, @IsNotEmpty).
 *    - Conversión de Tipos: @Type(() => Number) transforma cadenas ("1500") provenientes del cliente en números reales (1500).
 *    - Paso a la Entidad: Si todo es válido, la clase es entregada a 'PaquetesService', la cual inserta los campos
 *      directamente en el modelo 'PaqueteTuristico' de Prisma 7 en SQLite.
 * =========================================================================================
 */

// Importamos los decoradores de validación de la librería class-validator
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
// Importamos Type de class-transformer para convertir automáticamente strings de query/body a números
import { Type } from 'class-transformer';

// Definición de la clase DTO (Data Transfer Object) para validar la creación de paquetes turísticos
export class CreatePaqueteDto {
  // Valida que el nombre sea de tipo string (texto)
  @IsString()
  // Valida que el nombre no sea una cadena vacía ni nula
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  // Valida que la imagen sea de tipo string (URL)
  @IsString()
  // Valida que la URL de la imagen no esté vacía
  @IsNotEmpty({ message: 'La URL de la imagen es obligatoria' })
  imagen: string;

  // Valida que la descripción sea texto
  @IsString()
  // Valida que la descripción no esté vacía
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  // Valida que el destino sea un texto
  @IsString()
  // Valida que el campo destino no esté vacío
  @IsNotEmpty({ message: 'El destino es obligatorio' })
  destino: string;

  // Fuerza la conversión del valor de entrada a un número tipo float/int
  @Type(() => Number)
  // Valida que el precio recibido sea un número válido
  @IsNumber({}, { message: 'El precio debe ser un número' })
  // Valida que el precio no sea un valor negativo
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  precio: number;

  // Convierte el valor de entrada a tipo número
  @Type(() => Number)
  // Valida que la duración sea de tipo número
  @IsNumber({}, { message: 'La duración en días debe ser un número' })
  // Valida que el viaje dure al menos 1 día
  @Min(1, { message: 'La duración debe ser de al menos 1 día' })
  duracionDias: number;

  // Convierte el valor a tipo número
  @Type(() => Number)
  // Valida que los cupos sean de tipo número
  @IsNumber({}, { message: 'Los cupos disponibles deben ser un número' })
  // Valida que no se registren cupos negativos
  @Min(0, { message: 'Los cupos no pueden ser negativos' })
  cuposDisponibles: number;

  // Indica que el campo estado es opcional (si no se envía, toma el valor por defecto true de la base de datos)
  @IsOptional()
  // Valida que si se incluye, sea de tipo booleano (true/false)
  @IsBoolean()
  estado?: boolean;
}
