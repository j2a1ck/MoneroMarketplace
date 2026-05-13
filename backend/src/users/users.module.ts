import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { userProvider } from './users.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...userProvider],
  exports: [UsersService],
})
export class UsersModule {}
