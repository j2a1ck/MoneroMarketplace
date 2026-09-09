import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.entity';
import { Repository } from 'typeorm';
import { StartChatDto } from './dto/start-chat.dto';
import { SendMessageDto } from './dto/send-message-dto';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
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

  async saveMessage(data: SendMessageDto, userId: number) {
    const message = this.messageRepository.create({
      chat: {
        chatId: data.chat,
      },
      sender: {
        userId,
      },
      text: data.text,
    });
    return await this.messageRepository.save(message);
  }

  async validateUserChatId(chatId: number, userId: number) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.chatId = :chatId', { chatId })
      .andWhere('(chat.buyerUserId = :userId OR chat.sellerUserId = :userId)', {
        userId,
      })
      .getOne();
    if (!chat) throw new ForbiddenException('Not participant');
    return chat;
  }

  async getMessage(
    chatId: number,
    userId: number,
    offset: number,
    limit: number,
  ) {
    await this.validateUserChatId(chatId, userId);

    const MAX_LIMIT = 101;

    if (limit > MAX_LIMIT) {
      throw new BadRequestException(`Limit can't be greater than ${MAX_LIMIT}`);
    }

    const skip = offset * limit;
    const [data, total] = await this.messageRepository.findAndCount({
      order: { createdAt: 'DESC' },
      where: {
        chat: { chatId: chatId },
      },

      take: limit,
      skip: skip,
    });
    return {
      data,
      pagination: {
        offset,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
