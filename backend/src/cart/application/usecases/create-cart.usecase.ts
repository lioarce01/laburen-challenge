import { Inject, Injectable } from '@nestjs/common';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { ICartRepository } from 'src/cart/domain/repository/cart.repository';

@Injectable()
export class CreateCartUseCase {
  constructor(@Inject(ICartRepository) private cartRepo: ICartRepository) {}

  async execute(items: { productId: number; qty: number }[]): Promise<Cart> {
    return this.cartRepo.createCart(items);
  }
}
