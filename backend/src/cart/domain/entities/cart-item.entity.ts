export class CartItem {
  constructor(
    public id: number,
    public cart_id: number,
    public product_id: number,
    public qty: number,
  ) {}
}
