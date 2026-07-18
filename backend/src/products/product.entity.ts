import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({type: "bytea", nullable: true })
  pic?: Buffer;

  @Column('decimal')
  discount: number;

  @Column({ type: 'float', nullable: true })
  rate: number;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;
}
