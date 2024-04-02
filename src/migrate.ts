import { NestFactory } from '@nestjs/core';
import { MigrationModule } from './nest_modules/database-module/migration/migration.module';
import { getConnectionToken } from '@nestjs/sequelize';
import { migrator } from './core/shared/infra/db/sequelize/migrator';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationModule, {
    logger: ['error'],
  });

  const sequelize = app.get(getConnectionToken());

  migrator(sequelize).runAsCLI();
}
bootstrap();
