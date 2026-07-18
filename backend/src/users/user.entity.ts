import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Comment } from 'src/products/comment.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'bytea', nullable: true })
  profile?: Buffer;

  @Column({ type: 'float', nullable: true })
  rate: number;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
