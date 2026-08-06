import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async listOfProducts(page: number, limit: number = 10) {
    const MAX_LIMIT = 101;

    if (limit > MAX_LIMIT) {
      throw new BadRequestException(`Limit can't be greater than ${MAX_LIMIT}`);
    }

    const skip = (page - 1) * limit;
    const [data, total] = await this.productRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  getProduct(productId: number) {
    const result = this.productRepository.findOne({
      where: {
        productId,
      },
      relations: {
        comments: true,
      },
    });
    return result;
  }

  async editProduct(
    productId: number,
    updateProductData: UpdateProductDto,
    userId: number,
  ) {
    const result = await this.productRepository.update(
      {
        productId,
        seller: {
          userId: userId,
        },
      },
      updateProductData,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return this.productRepository.findOneBy({
      productId,
      seller: {
        userId: userId,
      },
    });
  }

  async deleteProduct(productId: number, userId: number) {
    const result = await this.productRepository.softDelete({
      productId,
      seller: {
        userId: userId,
      },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return { message: 'Product has been deleted' };
  }

  async createProduct(
    dto: CreateProductDto,
    userId: number,
    pics: Array<Express.Multer.File>,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      pics: pics.map((file) => file.buffer),
      seller: {
        userId: userId,
      },
    });

    return await this.productRepository.save(product);
  }

  async searchProduct(query: string, page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;
    const [data, total] = await this.productRepository.findAndCount({
      order: { createdAt: 'DESC' },
      where: {
        title: ILike(`%${query}%`),
      },
      take,
      skip,
    });
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  findUserProducts(username: string): Promise<Product[]> {
    const products = this.productRepository.find({
      where: {
        seller: {
          username,
        },
      },
    });
    return products;
  }

  createComment(
    productId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...dto,
      product: {
        productId,
      },
      user: {
        userId,
      },
    });
    return this.commentRepository.save(comment);
  }
}
