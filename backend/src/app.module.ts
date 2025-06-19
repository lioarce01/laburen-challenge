import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { HealthController } from './common/controllers/healt-check.controller';

@Module({
  imports: [ProductModule, CartModule],
  controllers: [HealthController],
})
export class AppModule { }
