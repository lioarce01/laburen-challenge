import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cart } from 'src/cart/domain/entities/cart.entity';
import { ICartRepository } from 'src/cart/domain/repository/cart.repository';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) { }

  async getCartById(cartId: number): Promise<Cart | null> {
    return await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createCart(items: { product_id: number; qty: number }[]): Promise<Cart> {
    return await this.prisma.cart.create({
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
    const updatedCart = await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items: {
          upsert: items.map((item) => ({
            where: {
              cart_id_product_id: {
                cart_id: cartId,
                product_id: item.product_id,
              },
            },
            create: {
              product: { connect: { id: item.product_id } },
              qty: item.qty,
            },
            update: { qty: item.qty },
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

    return new Cart(
      updatedCart.id,
      updatedCart.created_at,
      updatedCart.updated_at,
      updatedCart.items
    );
  }
}
