import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.entity';
import { Repository } from 'typeorm';
import { StartChatDto } from './start-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async startChat(dto: StartChatDto, userId: number) {
    const chat = await this.chatRepository.save({
      product: {
        productId: dto.productId,
      },
      buyer: {
        userId: userId,
      },
      seller: {
        userId: dto.seller,
      },
    });

    return {
      chatId: chat.chatId,
      productId: chat.product.productId,
      buyerId: chat.buyer.userId,
      sellerId: chat.seller.userId,
      createdAt: chat.createdAt,
    };
  }
}
