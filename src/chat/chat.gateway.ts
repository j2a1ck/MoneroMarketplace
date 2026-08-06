import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private parseData(data: string) {
    const result: Record<string, string> = {};

    data.split('\n').forEach((line) => {
      const [key, ...value] = line.split(':');

      if (!key || value.length === 0) return;

      result[key.trim()] = value.join(':').trim();
    });

    return result;
  }
  @SubscribeMessage('joinChat')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const body = this.parseData(data);

    const room = `chat:${body.chatId}`;

    await client.join(room);

    console.log(`${client.id} joined ${room}`);

    return {
      event: 'joinedChat',
      data: {
        success: true,
        room,
      },
    };
  }

  @SubscribeMessage('leaveChat')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const body = this.parseData(data);

    const room = `chat:${body.chatId}`;

    await client.leave(room);

    console.log(`${client.id} left ${room}`);

    return {
      event: 'leftChat',
      data: {
        success: true,
        room,
      },
    };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const body = this.parseData(data);

    const room = `chat:${body.chatId}`;

    const message = {
      id: Date.now(),
      chatId: Number(body.chatId),
      senderId: Number(body.senderId),
      receiverId: Number(body.receiverId),
      text: body.text,
      createdAt: new Date(),
    };

    console.log(message);

    this.server.to(room).emit('newMessage', message);

    return {
      event: 'messageReceived',
      data: {
        success: true,
        message: 'Message sent successfully.',
        payload: message,
      },
    };
  }
}
