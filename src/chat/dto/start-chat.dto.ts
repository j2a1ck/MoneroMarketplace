import { IsNumber } from 'class-validator';

export class StartChatDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  seller: number;
}
