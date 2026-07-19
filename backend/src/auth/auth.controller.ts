import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './setMetadata';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/common/pipe/file-size-validation.pipe';
import { JwtUser } from 'src/common/types/jwt-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @UseInterceptors(FileInterceptor('file'))
  signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
  ) {
    console.log(file);
    return this.authService.signUp(
      signUpDto.username,
      signUpDto.password,
      file,
    );
  }
  //FIXME return reputation and profile  and ... except password
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: JwtUser) {
    return req.user;
  }
}
