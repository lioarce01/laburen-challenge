import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Product } from 'src/product/domain/entities/product.entity';
import { IProductRepository } from 'src/product/domain/repository/product.repository';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) { }

  async findAll(query?: string): Promise<Product[]> {
    if (!query) {
      // Si no hay query, devolvemos todos los productos con findMany()
      const products = await this.prisma.product.findMany();
      return products.map(
        (p) => new Product(p.id, p.name, p.description ?? '', p.price, p.stock),
      );
    }

    const search = `%${query}%`;

    const rawProducts = await this.prisma.$queryRaw<
      Array<{ id: number; name: string; description: string; price: number; stock: number }>
    >(Prisma.sql`
    SELECT id, name, description, price, stock
    FROM "Product"
    WHERE unaccent(name) ILIKE unaccent(${search})
       OR unaccent(description) ILIKE unaccent(${search})
  `);

    return rawProducts.map(
      (p) => new Product(p.id, p.name, p.description ?? '', p.price, p.stock),
    );
  }

  async findById(id: number): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    return p
      ? new Product(p.id, p.name, p.description ?? '', p.price, p.stock)
      : null;
  }
}
