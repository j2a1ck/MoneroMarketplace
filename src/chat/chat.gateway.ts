import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './ws.guard';
import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { WsUser } from './ws-user.decorator';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? [],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private parseData(data: string): Record<string, string> {
    const result: Record<string, string> = {};

    if (typeof data !== 'string') {
      throw new WsException('Invalid payload format.');
    }

    data.split('\n').forEach((line) => {
      const [key, ...value] = line.split(':');
      if (!key || value.length === 0) return;
      result[key.trim()] = value.join(':').trim();
    });

    return result;
  }

  private getValidChatId(data: string): {
    body: Record<string, string>;
    chatId: number;
  } {
    const body = this.parseData(data);
    const chatId = Number(body.chatId);

    if (!body.chatId || !Number.isInteger(chatId) || chatId <= 0) {
      throw new WsException('A valid chatId is required.');
    }

    return { body, chatId };
  }

  private toClientError(error: unknown): WsException {
    if (error instanceof ForbiddenException) {
      return new WsException('You are not a participant of this chat.');
    }
    if (error instanceof BadRequestException) {
      return new WsException(error.message);
    }

    return new WsException('An unexpected error occurred. Please try again.');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinChat')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
    @WsUser() userId: number,
  ) {
    const { chatId } = this.getValidChatId(data);
    const room = `chat:${chatId}`;
    try {
      await this.chatService.validateUserChatId(chatId, userId);

      await client.join(room);

      return {
        event: 'joinedChat',
        data: { success: true, room },
      };
    } catch (error) {
      throw this.toClientError(error);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leaveChat')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const { chatId } = this.getValidChatId(data);
    const room = `chat:${chatId}`;

    await client.leave(room);

    return {
      event: 'leftChat',
      data: { success: true, room },
    };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
    @WsUser() userId: number,
  ) {
    const { body, chatId } = this.getValidChatId(data);
    const text = body.text?.trim();

    if (!text) {
      throw new WsException('Message text cannot be empty.');
    }

    const room = `chat:${chatId}`;

    try {
      await this.chatService.validateUserChatId(chatId, userId);

      const saved = await this.chatService.saveMessage(
        { chat: chatId, text },
        userId,
      );

      const message = {
        messageId: saved.messageId,
        chatId,
        userId,
        text: saved.text,
        createdAt: saved.createdAt,
      };

      this.server.to(room).emit('newMessage', message);

      return {
        event: 'messageReceived',
        data: {
          success: true,
          message: 'Message sent successfully.',
          payload: message,
        },
      };
    } catch (error) {
      throw this.toClientError(error);
    }
  }
}
