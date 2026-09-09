import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { StartChatDto } from './dto/start-chat.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  startChat(@Body() dto: StartChatDto, @UserId() userId: number) {
    return this.chatService.startChat(dto, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':chatId/message')
  @HttpCode(HttpStatus.OK)
  getMessages(
    @UserId() userId: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Param('chatId') chatId: number,
  ) {
    return this.chatService.getMessage(chatId, userId, offset, limit);
  }
}
