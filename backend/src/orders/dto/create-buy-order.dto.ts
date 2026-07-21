import { IsNumber } from 'class-validator';

export class CreateBuyOrderDto {
  @IsNumber()
  productId: number;
}
