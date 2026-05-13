import { IsNotEmpty, MinLength } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
