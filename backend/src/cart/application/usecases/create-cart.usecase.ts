import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Cart } from "src/cart/domain/entities/cart.entity";
import { ICartRepository } from "src/cart/domain/repository/cart.repository";
import { IProductRepository } from "src/product/domain/repository/product.repository";

@Injectable()
export class CreateCartUseCase {
  constructor(
    @Inject(ICartRepository) private cartRepo: ICartRepository,
    @Inject(IProductRepository) private productRepo: IProductRepository
  ) { }

  async execute(
    items: { product_id: number; qty: number }[],
  ): Promise<Cart> {

    for (const item of items) {
      const product = await this.productRepo.findById(item.product_id);
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.product_id} does not exist`,
        );
      }
      if (item.qty <= 0) {
        throw new BadRequestException(
          `Quantity for product ID ${item.product_id} must be greater than 0`,
        );
      }
      if (item.qty > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${item.product_id}. Available: ${product.stock}, Requested: ${item.qty}`,
        );
      }
    }

    if (!items || items.length === 0) {
      throw new BadRequestException("Cart items cannot be empty");
    }

    return this.cartRepo.createCart(items);
  }
}