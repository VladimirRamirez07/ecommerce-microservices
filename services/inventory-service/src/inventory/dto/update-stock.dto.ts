import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { MovementType } from '../entities/inventory.entity';

export class UpdateStockDto {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsEnum(MovementType)
  type: MovementType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}