import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/setMetadata';
import { ProductsService } from 'src/products/products.service';

@Controller('users')
export class UserController {
  constructor(private readonly productService: ProductsService) {}

  @Public()
  @Get('/:username/products')
  findUserProducts(@Param('username') username: string) {
    return this.productService.findUserProducts(username);
  }
}
