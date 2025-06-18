import { Controller, Post, Body, Patch, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateCartUseCase } from 'src/cart/application/usecases/update-cart.usecase';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { CreateCartDto } from '../../dto/create-cart.dto';
import { CreateCartUseCase } from 'src/cart/application/usecases/create-cart.usecase';

@Controller('carts')
export class CartController {
  constructor(
    private updateCartUseCase: UpdateCartUseCase,
    private createCartUseCase: CreateCartUseCase
  ) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() dto: CreateCartDto,
  ): Promise<Cart> {
    return this.createCartUseCase.execute(dto.items);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateCartDto,
  ): Promise<Cart> {
    return this.updateCartUseCase.execute(+id, dto.items);
  }
}
