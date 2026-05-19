import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  commentText: string;

  @ManyToOne(() => Product, (product) => product.comments)
  product: Product;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: false,
  })
  user: User;
}
