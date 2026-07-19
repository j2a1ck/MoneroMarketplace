import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtUser } from 'src/common/types/jwt-user.type';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
  ) {}

  async listOfProducts(page: number, limit: number = 10) {
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

  async editProduct(productId: number, updateProductData: Partial<Product>) {
    const result = await this.productRepository.update(
      productId,
      updateProductData,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return this.productRepository.findOneBy({ productId });
  }

  async deleteProduct(productId: number) {
    const result = await this.productRepository.softDelete(productId);
    if (result.affected === 0) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return {
      message: 'Product deleted successfully',
      id: productId,
    };
  }

  async createProduct(dto: CreateProductDto, user: JwtUser) {
    const product = this.productRepository.create({
      ...dto,
      user: {
        userId: user.user.sub,
      },
    });

    return this.productRepository.save(product);
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
}
