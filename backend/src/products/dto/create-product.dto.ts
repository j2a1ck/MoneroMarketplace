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

export class CreateProductDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;

  @IsOptional()
  //FIXME upload pic && upload multiple also for PATCH method
  pic?: Buffer;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount cannot be less than 0' })
  @Max(100, { message: 'Discount cannot exceed 100' })
  @Type(() => Number)
  discount: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  @Type(() => Number)
  price: number;
}
