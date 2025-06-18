import { Module } from '@nestjs/common';
import { CartController } from './interfaces/http/controllers/cart.controller';
import { UpdateCartUseCase } from './application/usecases/update-cart.usecase';
import { ICartRepository } from './domain/repository/cart.repository';
import { PrismaCartRepository } from './infrastructure/repositories/prisma-cart.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { CreateCartUseCase } from './application/usecases/create-cart.usecase';
import { IProductRepository } from 'src/product/domain/repository/product.repository';
import { PrismaProductRepository } from 'src/product/infrastructure/repositories/prisma-product-repository';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    UpdateCartUseCase,
    CreateCartUseCase,
    { provide: ICartRepository, useClass: PrismaCartRepository },
    { provide: IProductRepository, useClass: PrismaProductRepository },
  ],
})
export class CartModule { }
