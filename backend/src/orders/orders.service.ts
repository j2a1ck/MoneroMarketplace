import { Injectable, Inject } from '@nestjs/common';
// import { CreateBuyOrderDto } from './dto/create-buy-order.dto';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { JwtUser } from 'src/common/types/jwt-user.type';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
  ) {}
  async buyRequest(productId: number, user: JwtUser) {
    const order = this.orderRepository.create({
      product: {
        productId: productId,
      },
      buyer: {
        userId: user.user.sub,
      },
      price: 0,
    });

    return this.orderRepository.save(order);
  }
}
