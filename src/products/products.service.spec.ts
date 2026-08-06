import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockProductRepository = () => ({
  findAndCount: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

export const mockCommentRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: ReturnType<typeof mockProductRepository>;

  beforeEach(async () => {
    productRepository = mockProductRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listOfProducts', () => {
    it('should return paginated products', async () => {
      const products = [
        {
          productId: 1,
          title: 'p1',
        },
      ] satisfies Partial<Product>[];

      productRepository.findAndCount.mockResolvedValue([products, 1]);

      const result = await service.listOfProducts(1, 10);

      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        data: products,
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('editProduct', () => {
    it('should update product and return it', async () => {
      const updatedProduct = {
        productId: 1,
        title: 'updated',
      } satisfies Partial<Product>;

      productRepository.update.mockResolvedValue({
        affected: 1,
      });

      productRepository.findOneBy.mockResolvedValue(updatedProduct);

      const result = await service.editProduct(
        1,
        {
          title: 'update',
          description: 'updated description',
          price: 100,
        },
        1,
      );
      expect(productRepository.update).toHaveBeenCalledWith(
        {
          productId: 1,
          seller: {
            userId: 1,
          },
        },
        {
          title: 'update',
          description: 'updated description',
          price: 100,
        },
      );
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        productId: 1,
        seller: {
          userId: 1,
        },
      });

      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product', async () => {
      productRepository.softDelete.mockResolvedValue({
        affected: 1,
      });

      const result = await service.deleteProduct(1, 1);

      expect(productRepository.softDelete).toHaveBeenCalledWith({
        productId: 1,
        seller: {
          userId: 1,
        },
      });

      expect(result).toEqual({
        message: 'Product has been deleted',
      });
    });
  });

  describe('createProduct', () => {
    it('should create product', async () => {
      const dto = {
        title: 'new product',
        description: 'product description',
        price: 100,
      };

      const product = {
        productId: 1,
        title: 'new product',
      } satisfies Partial<Product>;

      productRepository.create.mockReturnValue(product);
      productRepository.save.mockResolvedValue(product);

      const result = await service.createProduct(dto, 1, []);
      expect(productRepository.create).toHaveBeenCalledWith({
        ...dto,
        pics: [],
        seller: {
          userId: 1,
        },
      });

      expect(productRepository.save).toHaveBeenCalledWith(product);

      expect(result).toEqual(product);
    });
  });
});
