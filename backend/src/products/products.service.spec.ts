import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

const mockRepository = () => ({
  findAndCount: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'PRODUCT_REPOSITORY',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get('PRODUCT_REPOSITORY');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listOfProducts', () => {
    it('should return paginated products', async () => {
      repository.findAndCount.mockResolvedValue([
        [{ id: 1, title: 'p1' } as any],
        1,
      ]);
      const result = await service.listOfProducts(1, 10);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 10,
        skip: 0,
      });
      expect(result).toEqual({
        data: [{ id: 1, title: 'p1' }],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('editProducts', () => {
    it('should update product and return it', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOneBy.mockResolvedValue({
        productId: 1,
        title: 'updated',
      } as any);

      const result = await service.editProduct(1, { title: 'update' });

      expect(repository.update).toHaveBeenCalledWith(1, { title: 'update' });

      expect(repository.findOneBy).toHaveBeenCalledWith({ productId: 1 });

      expect(result).toEqual({
        productId: 1,
        title: 'updated',
      });
    });
  });

  describe('deleteProducts', () => {
    it('should soft delete product', async () => {
      repository.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteProduct(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        message: 'Product deleted successfully',
        id: 1,
      });
    });
  });

  describe('createProducts', () => {
    it('should create product', async () => {
      repository.save.mockResolvedValue({
        productId: 1,
        title: 'new product',
      } as any);

      const dto = { title: 'new product' } as any;
      const result = await service.createProduct(dto);
      expect(repository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        productId: 1,
        title: 'new product',
      });
    });
  });
});
