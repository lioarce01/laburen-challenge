import { Module } from '@nestjs/common';
import { ProductController } from './interfaces/http/controllers/product.controller';
import { ListProductsUseCase } from './application/usecases/list-products.usecase';
import { GetProductUseCase } from './application/usecases/get-product.usecase';
import { IProductRepository } from './domain/repository/product.repository';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product-repository';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    { provide: IProductRepository, useClass: PrismaProductRepository },
  ],
})
export class ProductModule {}
