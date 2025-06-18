import { Inject, Injectable } from '@nestjs/common';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { ICartRepository } from 'src/cart/domain/repository/cart.repository';

@Injectable()
export class UpdateCartUseCase {
  constructor(@Inject(ICartRepository) private cartRepo: ICartRepository) { }

  async execute(
    cartId: number,
    items: { product_id: number; qty: number }[],
  ): Promise<Cart> {
    return this.cartRepo.updateCart(cartId, items);
  }
}