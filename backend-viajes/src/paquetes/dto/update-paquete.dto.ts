import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaqueteDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duracionDias?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cuposDisponibles?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
