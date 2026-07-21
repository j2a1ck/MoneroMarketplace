import {
  Controller,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Post,
  UseGuards,
  Query,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/setMetadata';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { FileSizeValidationPipe } from 'src/common/pipe/file-size-validation.pipe';
import { JwtUser } from 'src/common/types/jwt-user.type';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/')
  listOfProducts(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.productService.listOfProducts(+page, +limit);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProduct(productId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('pics', 6))
  @HttpCode(HttpStatus.OK)
  editProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Req() req: JwtUser,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(new FileSizeValidationPipe())
    pics?: Array<Express.Multer.File>,
  ) {
    if (pics) {
      updateProductDto.pics = pics.map((file) => file.buffer);
    }
    return this.productService.editProduct(productId, updateProductDto, req);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('pics', 6))
  @HttpCode(HttpStatus.CREATED)
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: JwtUser,
    @UploadedFiles(new FileSizeValidationPipe())
    pics?: Array<Express.Multer.File>,
  ) {
    if (pics) {
      createProductDto.pics = pics.map((file) => file.buffer);
    }
    return this.productService.createProduct(createProductDto, req);
  }

  @Public()
  @Get('/search')
  @HttpCode(HttpStatus.ACCEPTED)
  searchProduct(@Query() searchProductDto: SearchProductDto) {
    return this.productService.searchProduct(
      searchProductDto.q,
      searchProductDto.page,
    );
  }
}
