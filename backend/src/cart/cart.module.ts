import { Module } from '@nestjs/common';
import { CartController } from './interfaces/http/controllers/cart.controller';
import { CreateCartUseCase } from './application/usecases/create-cart.usecase';
import { UpdateCartUseCase } from './application/usecases/update-cart.usecase';
import { ICartRepository } from './domain/repository/cart.repository';
import { PrismaCartRepository } from './infrastructure/repositories/prisma-cart-repository';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    CreateCartUseCase,
    UpdateCartUseCase,
    { provide: ICartRepository, useClass: PrismaCartRepository },
  ],
})
export class CartModule {}
