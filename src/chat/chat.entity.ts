import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Message } from 'src/chat/message.entity';
import { Product } from 'src/products/product.entity';
@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => User)
  buyer: User;

  @ManyToOne(() => User)
  seller: User;

  @OneToMany(() => Message, (message) => message.chat)
  message: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
