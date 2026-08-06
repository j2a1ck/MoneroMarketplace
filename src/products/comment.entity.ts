import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @ManyToOne(() => Product, (product) => product.comments, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: false,
    onDelete: 'RESTRICT',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
