import { Entity } from 'src/core/shared/domain/entity';
import { NotFoundErrorFilter } from './not-found-error.filter';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { NotFoundError } from 'src/core/shared/domain/errors/not-found.error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

class StubEntity extends Entity {
  entity_id: any;
  toJSON() {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('fake id', StubEntity);
  }
}

describe('NotFoundErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should cat a EntityValidationError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'StubEntity Not Found using ID fake id',
    });
  });
});