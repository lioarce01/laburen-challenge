import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateCartUseCase } from 'src/cart/application/usecases/create-cart.usecase';
import { UpdateCartUseCase } from 'src/cart/application/usecases/update-cart.usecase';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { CreateCartDto } from '../../dto/create-cart.dto';

@Controller('carts')
export class CartController {
  constructor(
    private createCart: CreateCartUseCase,
    private updateCart: UpdateCartUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCartDto): Promise<Cart> {
    return this.createCart.execute(dto.items);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateCartDto,
  ): Promise<Cart> {
    return this.updateCart.execute(+id, dto.items);
  }
}
