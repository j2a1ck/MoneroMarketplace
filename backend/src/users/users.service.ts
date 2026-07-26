import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import 'multer';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException("Can't find that User");
    }
    return user;
  }

  async add(
    username: string,
    hashedPassword: string,
    file: Express.Multer.File,
  ): Promise<User | null> {
    return this.userRepository.save({
      username,
      hashedPassword,
      profile: file.buffer,
    });
  }
}
