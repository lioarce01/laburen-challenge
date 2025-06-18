import { IsInt, Min } from "class-validator";

export class CartItemDto {
  @IsInt()
  product_id: number;

  @IsInt()
  @Min(1)
  qty: number;
}