import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from 'src/database/database.module';
import { orderProviders } from './orders.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, ...orderProviders],
})
export class OrdersModule {}
