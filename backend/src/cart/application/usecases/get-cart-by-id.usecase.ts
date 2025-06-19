import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Cart } from "src/cart/domain/entities/cart.entity";
import { ICartRepository } from "src/cart/domain/repository/cart.repository";


@Injectable()
export class GetCartByIdUseCase {
  constructor(
    @Inject(ICartRepository) private cartRepository: ICartRepository
  ) { }

  async getCartById(cartId: number): Promise<Cart | null> {
    const cart = this.cartRepository.getCartById(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    return cart;
  }
}