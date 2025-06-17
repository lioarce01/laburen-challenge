import { Injectable, Inject } from '@nestjs/common';
import { Product } from 'src/product/domain/entities/product.entity';
import { IProductRepository } from 'src/product/domain/repository/product.repository';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(IProductRepository) private productRepo: IProductRepository,
  ) {}

  async execute(q?: string): Promise<Product[]> {
    return this.productRepo.findAll(q);
  }
}
