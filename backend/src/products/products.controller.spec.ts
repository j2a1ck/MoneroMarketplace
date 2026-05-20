import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    listOfProducts: jest.fn(),
    deleteProduct: jest.fn(),
    editProduct: jest.fn(),
    createProduct: jest.fn(),
  };

  const mockAuthGuard = {
    canActive: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listOfProducts', () => {
    it('should call the service with page and limit', async () => {
      mockProductsService.listOfProducts.mockResolvedValue(['product1']);

      const result = await controller.listOfProducts(1, 10);

      expect(mockProductsService.listOfProducts).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(['product1']);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product by id', async () => {
      mockProductsService.deleteProduct.mockResolvedValue({
        message: 'Product deleted successfully',
        id: 5,
      });
      const result = await controller.deleteProduct(5);

      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(5);
      expect(result).toEqual({
        message: 'Product deleted successfully',
        id: 5,
      });
    });
  });

  describe('editProduct', () => {
    it('should update Product', async () => {
      const dto = { title: 'update' } as any;

      mockProductsService.editProduct.mockResolvedValue({
        productId: 1,
        title: 'update',
      });
      const result = await controller.editProduct(1, dto);
      expect(mockProductsService.editProduct).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        productId: 1,
        title: 'update',
      });
    });
  });

  describe('createProduct', () => {
    it('should create Product', async () => {
      const dto = { title: 'create' } as any;

      mockProductsService.createProduct.mockResolvedValue({
        title: 'create',
      });
      const result = await controller.createProduct(dto);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        title: 'create',
      });
    });
  });
});
