import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/domain/entities/product.entity';
import { IProductRepository } from 'src/product/domain/repository/product.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(IProductRepository) private productRepo: IProductRepository,
  ) {}

  async execute(id: number): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
