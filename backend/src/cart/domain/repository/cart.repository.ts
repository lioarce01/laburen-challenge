import { Cart } from '../entities/cart.entity';

export const ICartRepository = Symbol('ICartRepository');

export interface ICartRepository {
  createCart(items: { productId: number; qty: number }[]): Promise<Cart>;
  updateCart(
    cartId: number,
    items: { productId: number; qty: number }[],
  ): Promise<Cart>;
}
