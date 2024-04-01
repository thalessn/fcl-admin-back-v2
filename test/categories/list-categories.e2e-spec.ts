import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CategoryOutputMapper } from '../../src/core/category/application/use-cases/common/category-output';
import { CategoriesController } from '../../src/nest_modules/categories-module/categories.controller';
import { ListCategoriesFixture } from '../../src/nest_modules/categories-module/testing/category-fixtures';
import { startApp } from '../../src/nest_modules/shared-module/testing/helpers';
import { CATEGORY_PROVIDERS } from 'src/nest_modules/categories-module/categories.providers';

describe('CategoriesController (e2e)', () => {
  describe('/categories (GET)', () => {
    describe('should return categories sorted by created_at when request query is empty', () => {
      let categoryRepo: ICategoryRepository;
      const appHelper = startApp();
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        categoryRepo = appHelper.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(appHelper.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return categories using paginate, filter and sort', () => {
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each([arrange])(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
