import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import 'multer';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 12;
    return bcrypt.hash(password, saltOrRounds);
  }

  async signUp(
    username: string,
    password: string,
    picture?: Express.Multer.File,
  ): Promise<User> {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username has already taken');
    }
    const hashedPassword = await this.hashPassword(password);
    await this.usersService.add(username, hashedPassword, picture);

    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return user;
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneWithPassword(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.userId !== userId) {
      throw new ForbiddenException();
    }

    return user;
  }
}
