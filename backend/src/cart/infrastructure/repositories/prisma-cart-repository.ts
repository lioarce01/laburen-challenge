import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { ICartRepository } from 'src/cart/domain/repository/cart.repository';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) {}
  async createCart(items: { productId: number; qty: number }[]): Promise<Cart> {
    const cart = this.prisma.cart.create({
      // create the cart and related cart items in one transaction for atomicity
      data: {
        items: {
          create: items.map((i) => ({
            product: { connect: { id: i.productId } },
            qty: i.qty,
          })),
        },
      },
      include: { items: true },
    });

    return cart;
  }
  async updateCart(
    cartId: number,
    items: { productId: number; qty: number }[],
  ): Promise<Cart> {
    await this.prisma.cartItem.deleteMany({ where: { cart_id: cartId } }); // delete all items before updating and recreate the cart

    const cart = this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items: {
          deleteMany: {},
          create: items.map((i) => ({
            product: { connect: { id: i.productId } },
            qty: i.qty,
          })),
        },
      },
      include: { items: true },
    });

    return cart;
  }
}
