// Importamos los decoradores de validación de class-validator
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
// Importamos Type para la transformación automática de string de la URL a número
import { Type } from 'class-transformer';

// Clase DTO para capturar y validar los parámetros de consulta (Query Params) de paginación y búsqueda
export class PaginationQueryDto {
  // Marca el parámetro de búsqueda como opcional (ej: ?search=Cancun)
  @IsOptional()
  // Valida que el término de búsqueda sea un texto
  @IsString()
  search?: string;

  // Marca el número de página como opcional (ej: ?page=1)
  @IsOptional()
  // Transforma la cadena "1" de la URL al número 1
  @Type(() => Number)
  // Valida que el número de página sea un número
  @IsNumber()
  // Valida que el número de página sea de al menos 1
  @Min(1)
  // Asigna la página 1 como valor por defecto si no se especifica en la URL
  page?: number = 1;

  // Marca la cantidad de registros por página como opcional (ej: ?limit=10)
  @IsOptional()
  // Transforma la cadena "10" de la URL al número 10
  @Type(() => Number)
  // Valida que el límite sea de tipo número
  @IsNumber()
  // Valida que se pida al menos 1 registro por página
  @Min(1)
  // Asigna 10 registros como límite por defecto si no se especifica en la URL
  limit?: number = 10;
}
