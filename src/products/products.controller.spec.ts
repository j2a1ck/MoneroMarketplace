jest.mock('../common/pipe/file-validation.pipe', () => ({
  ImageValidationPipe: class ImageValidationPipe {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    listOfProducts: jest.fn(),
    getProduct: jest.fn(),
    deleteProduct: jest.fn(),
    editProduct: jest.fn(),
    createProduct: jest.fn(),
    searchProduct: jest.fn(),
    createComment: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
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
    it('should call service with page and limit', async () => {
      const products = ['product1'];

      mockProductsService.listOfProducts.mockResolvedValue(products);

      const result = await controller.listOfProducts(1, 10);

      expect(mockProductsService.listOfProducts).toHaveBeenCalledWith(1, 10);

      expect(result).toEqual(products);
    });
  });

  describe('getProduct', () => {
    it('should return product', async () => {
      const product = {
        productId: 1,
        title: 'product',
      };

      mockProductsService.getProduct.mockResolvedValue(product);

      const result = await controller.getProduct(1);

      expect(mockProductsService.getProduct).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const response = {
        message: 'Product has been deleted',
      };

      mockProductsService.deleteProduct.mockResolvedValue(response);

      const result = await controller.deleteProduct(5, 1);

      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(5, 1);

      expect(result).toEqual(response);
    });
  });

  describe('editProduct', () => {
    it('should update product without pictures', async () => {
      const dto: UpdateProductDto = {
        title: 'updated',
        description: 'updated description',
        price: 200,
      };

      const product = {
        productId: 1,
        title: 'updated',
      };

      mockProductsService.editProduct.mockResolvedValue(product);

      const result = await controller.editProduct(1, 1, dto, []);

      expect(mockProductsService.editProduct).toHaveBeenCalledWith(1, dto, 1);

      expect(result).toEqual(product);
    });

    it('should add pictures to dto', async () => {
      const dto: UpdateProductDto = {
        title: 'updated',
        description: 'updated description',
        price: 200,
      };

      const pics = [
        {
          buffer: Buffer.from('image'),
        },
      ] as Express.Multer.File[];

      mockProductsService.editProduct.mockResolvedValue({
        productId: 1,
      });

      await controller.editProduct(1, 1, dto, pics);

      expect(mockProductsService.editProduct).toHaveBeenCalledWith(
        1,
        {
          title: 'updated',
          description: 'updated description',
          price: 200,
          pics: [Buffer.from('image')],
        },
        1,
      );
    });
  });

  describe('createProduct', () => {
    it('should create product', async () => {
      const dto: CreateProductDto = {
        title: 'new product',
        description: 'product description',
        price: 100,
      };

      const product = {
        productId: 1,
        title: 'new product',
      };

      mockProductsService.createProduct.mockResolvedValue(product);

      const result = await controller.createProduct(dto, 1, []);

      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        dto,
        1,
        [],
      );

      expect(result).toEqual(product);
    });
  });

  describe('searchProduct', () => {
    it('should search products', async () => {
      const response = {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      };

      mockProductsService.searchProduct.mockResolvedValue(response);

      const dto = {
        q: 'phone',
        page: 1,
      };

      const result = await controller.searchProduct(dto);

      expect(mockProductsService.searchProduct).toHaveBeenCalledWith(
        'phone',
        1,
      );

      expect(result).toEqual(response);
    });
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      const dto = {
        content: 'nice product',
      };

      const comment = {
        id: 1,
        content: 'nice product',
      };

      mockProductsService.createComment.mockResolvedValue(comment);

      const result = await controller.createComment(1, dto, 1);

      expect(mockProductsService.createComment).toHaveBeenCalledWith(1, 1, dto);

      expect(result).toEqual(comment);
    });
  });
});
