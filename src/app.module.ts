import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest_modules/categories-module/categories.module';
import { DatabaseModule } from './nest_modules/database-module/database.module';
import { ConfigModule } from './nest_modules/config-module/config.module';
import { SharedModule } from './nest_modules/shared-module/shared.module';
import { CastMembersModule } from './nest_modules/cast-members-module/cast-members-module.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
    CastMembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
