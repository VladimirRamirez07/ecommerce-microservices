import { IsString, IsNumber, IsOptional, IsArray, Min, IsMongoId } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  sku: string;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  attributes?: Record<string, any>;
}