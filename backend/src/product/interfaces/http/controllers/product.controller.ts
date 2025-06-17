import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductUseCase } from 'src/product/application/usecases/get-product.usecase';
import { ListProductsUseCase } from 'src/product/application/usecases/list-products.usecase';
import { Product } from 'src/product/domain/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    private listProducts: ListProductsUseCase,
    private getProduct: GetProductUseCase,
  ) {}

  @Get()
  async findAll(@Query('q') q?: string): Promise<Product[]> {
    return this.listProducts.execute(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.getProduct.execute(+id);
  }
}
