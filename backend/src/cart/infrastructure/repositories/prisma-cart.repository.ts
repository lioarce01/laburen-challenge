import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { ICartRepository } from 'src/cart/domain/repository/cart.repository';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) { }

  createCart(items: { product_id: number; qty: number }[]): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.product_id } },
            qty: item.qty,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateCart(
    cartId: number,
    items: { product_id: number; qty: number }[],
  ): Promise<Cart> {
    await this.prisma.cartItem.deleteMany({ where: { cart_id: cartId } });

    const updated = await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.product_id } },
            qty: item.qty,
          })),
        },
        updated_at: new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  }
}
