import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
import { ImageValidationPipe } from 'src/common/pipe/file-validation.pipe';
import { UserId } from 'src/common/decorators/user-id.decorator';

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
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UseInterceptors(FileInterceptor('picture'))
  signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile(new ImageValidationPipe())
    picture?: Express.Multer.File,
  ) {
    return this.authService.signUp(
      signUpDto.username,
      signUpDto.password,
      picture,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/me')
  getProfile(@UserId() userId: number) {
    return this.authService.getProfile(userId);
  }
}
