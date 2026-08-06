import {
  Controller,
  UseGuards,
  Post,
  HttpStatus,
  HttpCode,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrdersService } from './orders.service';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post('/:orderId')
  @HttpCode(HttpStatus.CREATED)
  buyRequest(
    @Param('orderId', ParseIntPipe) productId: number,
    @UserId() userId: number,
  ) {
    return this.ordersService.buyRequest(productId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:orderId/accept')
  @HttpCode(HttpStatus.OK)
  acceptOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UserId() userId: number,
  ) {
    return this.ordersService.acceptOrder(orderId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:orderId/cancel')
  @HttpCode(HttpStatus.OK)
  cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UserId() userId: number,
  ) {
    return this.ordersService.cancelOrder(orderId, userId);
  }
}
