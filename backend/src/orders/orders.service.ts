import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async buyRequest(productId: number, userId: number) {
    const product = await this.productRepository.findOne({
      where: {
        productId: productId,
      },
      relations: {
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newOrder = this.orderRepository.create({
      product: {
        productId,
      },
      buyer: {
        userId,
      },
      seller: product.seller,
      price: product.price,
    });

    const saveOrder = await this.orderRepository.save(newOrder);
    return this.orderRepository.find({
      where: {
        orderId: saveOrder.orderId,
      },
    });
  }

  async acceptOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        orderId,
        seller: { userId },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.ACCEPTED;

    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        orderId,
        seller: { userId },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.CANCELLED;

    return this.orderRepository.save(order);
  }
}
