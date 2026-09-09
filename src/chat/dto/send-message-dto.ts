import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMessageDto {
  @Type(() => Number)
  @IsInt({ message: 'chatId must be an integer' })
  @Min(1, { message: 'chatId must be greater than 0' })
  chat: number;

  @IsString({ message: 'text must be a string' })
  text: string;
}
