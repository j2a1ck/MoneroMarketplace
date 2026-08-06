import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import 'multer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async findOneById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { userId },
    });
  }

  async add(
    username: string,
    password: string,
    picture?: Express.Multer.File,
  ): Promise<User> {
    return this.userRepository.save({
      username,
      password,
      profile: picture?.buffer,
    });
  }
  async findOneWithPassword(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }
}
