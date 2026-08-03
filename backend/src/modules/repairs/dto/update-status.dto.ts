import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoReparacion } from '../enums/estado-reparacion.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    enum: EstadoReparacion,
    description: 'Nuevo estado de la reparación',
  })
  @IsEnum(EstadoReparacion)
  estado: EstadoReparacion;

  @ApiProperty({
    description: 'Nota opcional del técnico sobre el cambio de estado',
    required: false,
  })
  @IsOptional()
  @IsString()
  nota?: string;
}
