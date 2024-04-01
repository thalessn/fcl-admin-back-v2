import { Category } from 'src/core/category/domain/category.entity';
import { ICategoryRepository } from 'src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from 'src/nest_modules/categories-module/categories.providers';
import { startApp } from 'src/nest_modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();

  describe('should response error when id is invalid or not found', () => {
    const arrange = [
      {
        id: '63a55d78-faf5-448f-99de-acf6b429bfd7',
        expected: {
          message:
            'Category Not Found using ID 63a55d78-faf5-448f-99de-acf6b429bfd7',
          statusCode: 404,
          error: 'Not Found',
        },
      },
      {
        id: 'fake id',
        expected: {
          message: 'Validation failed (uuid is expected)',
          statusCode: 422,
          error: 'Unprocessable Entity',
        },
      },
    ];

    test.each(arrange)('when body id', ({ id, expected }) => {
      return request(appHelper.app.getHttpServer())
        .delete(`/categories/${id}`)
        .send(id)
        .expect(expected.statusCode)
        .expect(expected);
    });
  });

  it('should delete a category with response status 204', async () => {
    const categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);

    await request(appHelper.app.getHttpServer())
      .delete(`/categories/${category.category_id.id}`)
      .expect(204);

    await expect(
      categoryRepo.findById(category.category_id),
    ).resolves.toBeNull();
  });
});
