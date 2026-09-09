import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Chat } from 'src/chat/chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  text: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.message)
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
