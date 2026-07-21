import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;

  @IsOptional()
  pics?: Buffer[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  @Type(() => Number)
  price: number;
}
