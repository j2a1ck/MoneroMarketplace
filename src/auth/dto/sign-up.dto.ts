import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class SignUpDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(14)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
