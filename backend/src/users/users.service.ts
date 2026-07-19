import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import 'multer';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async add(
    username: string,
    password: string,
    file: Express.Multer.File,
  ): Promise<User | null> {
    return this.userRepository.save({
      username,
      password,
      profile: file.buffer,
    });
  }
}
