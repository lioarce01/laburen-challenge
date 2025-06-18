import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Cart } from "src/cart/domain/entities/cart.entity";
import { ICartRepository } from "src/cart/domain/repository/cart.repository";

@Injectable()
export class CreateCartUseCase {
  constructor(@Inject(ICartRepository) private cartRepo: ICartRepository) { }

  async execute(
    items: { product_id: number; qty: number }[],
  ): Promise<Cart> {
    if (!items || items.length === 0) {
      throw new BadRequestException("Cart items cannot be empty");
    }

    return this.cartRepo.createCart(items);
  }
}