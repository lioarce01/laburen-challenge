import { IsArray, ValidateNested } from 'class-validator';
import { CartItemDto } from './cart-item.dto';
import { Type } from 'class-transformer';

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}