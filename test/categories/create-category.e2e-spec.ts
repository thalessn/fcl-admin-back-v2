import request from 'supertest';
import { CreateCategoryFixture } from './../../src/nest_modules/categories-module/testing/category-fixtures';
import { ICategoryRepository } from './../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from './../../src/nest_modules/categories-module/categories.providers';
import { startApp } from './../../src/nest_modules/shared-module/testing/helpers';
import { Uuid } from './../../src/core/shared/domain/value-objects/uuid.vo';
import { CategoryOutputMapper } from './../../src/core/category/application/use-cases/common/category-output';
import { instanceToPlain } from 'class-transformer';
import { CategoriesController } from './../../src/nest_modules/categories-module/categories.controller';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let repository: ICategoryRepository;

  beforeEach(async () => {
    repository = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('/categories (POST)', () => {
    describe('should return a response error with 422 status code when body is invalid', () => {
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body label is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with 422 when throw EntityValidationError', () => {
      const invalidRequest =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body label is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();

      test.each(arrange)(
        'when body id $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const id = res.body.data.id;
          const categoryCreated = await repository.findById(new Uuid(id));
          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toOutput(categoryCreated),
          );

          const serialized = instanceToPlain(presenter); // instanceToPlain (ClassTransformer)
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
