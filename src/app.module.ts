import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/data-base.module';
import { UsersModule } from './features/users/user.module';
import { AuthModule } from './features/auth/auth.module';
import { BranchesModule } from './features/branches/branches.module';
import { CategoriesModule } from './features/categories/categories.module';
import { CarMakesModule } from './features/car-makes/car-make.module';
import { CarModelsModule } from './features/car-models/car-model.module';
import { ProductsModule } from './features/products/products.module';
import { ColorsModule } from './features/colors/colors.module';
import { MaterialsModule } from './features/materials/materials.module';
import { OrdersModule } from './features/orders/orders.module';
import { BannersModule } from './features/banners/banners.module';
import { ImagesModule } from './features/images/image.module';
import { SocialLinksModule } from './features/social-links/social-links.module';
import { ArticulsModule } from './features/articuls/articuls.module';
import { CustomModelsModule } from './features/custom-models/custom-models.module';
import { PartsModule } from './features/parts/parts.module';
import { ProductColorsModule } from './features/product-colors/product-colors.module';
import { OrderItemsModule } from './features/order-items/order-items.module';
import { StaticInfoModule } from './features/static-info/static-info.module';
import { RequestsModule } from './features/requests/requests.module';
import { CartModule } from './features/cart/cart.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    BranchesModule,
    CategoriesModule,
    CarMakesModule,
    CarModelsModule,
    ProductsModule,
    ColorsModule,
    MaterialsModule,
    OrdersModule,
    BannersModule,
    ImagesModule,
    SocialLinksModule,
    ArticulsModule,
    CustomModelsModule,
    PartsModule,
    ProductColorsModule,
    OrderItemsModule,
    StaticInfoModule,
    RequestsModule,
    CartModule,
  ],
})
export class AppModule {}
