import {
  Controller,
  UseGuards,
  Post,
  HttpStatus,
  HttpCode,
  Body,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrdersService } from './orders.service';
import { CreateBuyOrderDto } from './dto/create-buy-order.dto';
import { JwtUser } from 'src/common/types/jwt-user.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post('buy-requests')
  @HttpCode(HttpStatus.OK)
  buyRequest(@Body() dto: CreateBuyOrderDto, @Req() req: JwtUser) {
    return this.ordersService.buyRequest(dto.productId, req);
  }
}
