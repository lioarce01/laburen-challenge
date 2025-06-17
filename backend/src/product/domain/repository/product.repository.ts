import { Product } from '../entities/product.entity';

export const IProductRepository = Symbol('IProductRepository');

export interface IProductRepository {
  findAll(query?: string): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
}
