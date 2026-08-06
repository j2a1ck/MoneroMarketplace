import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { StartChatDto } from './start-chat.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  startChat(@Body() dto: StartChatDto, @UserId() userId: number) {
    return this.chatService.startChat(dto, userId);
  }
}
