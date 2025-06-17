import { CartItem } from './cart-item.entity';

export class Cart {
  constructor(
    public id: number,
    public created_at: Date,
    public updated_at: Date,
    public items: CartItem[],
  ) {}
}
