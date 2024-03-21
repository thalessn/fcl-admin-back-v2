import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories-module/categories.controller';
import { DatabaseModule } from '../database-module/database.module';
import { CategoriesModule } from '../categories-module/categories.module';
import { ConfigModule } from '../config-module/config.module';
import { ConfigService } from '@nestjs/config';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    console.log(module.get(ConfigService).get('DB_HOST'));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
