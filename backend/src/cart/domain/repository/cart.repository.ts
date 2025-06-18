import { Cart } from '../entities/cart.entity';

export const ICartRepository = Symbol('ICartRepository');

export interface ICartRepository {
  updateCart(
    cartId: number,
    items: { product_id: number; qty: number }[]
  ): Promise<Cart>;
  createCart(items: { product_id: number, qty: number }[]): Promise<Cart>;
}
