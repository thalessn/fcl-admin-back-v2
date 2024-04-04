import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategorySequelizeRepository } from '../../../../../shared/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../shared/infra/db/sequelize/category.model';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { GetCategoryUsecase } from '../get-category.use-case';

describe('Get Category Use Case Integration Tests', () => {
  let repository: CategorySequelizeRepository;
  let usecase: GetCategoryUsecase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    usecase = new GetCategoryUsecase(repository);
  });

  it('should throw a error when category not found', async () => {
    const uuid = new CategoryId();
    await expect(usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    );
  });

  it('should get a category', async () => {
    const category = Category.create({ name: 'Test' });
    await repository.insert(category);

    const hasEntity = await usecase.execute({ id: category.category_id.id });
    expect(hasEntity).toStrictEqual({
      id: category.category_id.id,
      name: 'Test',
      description: null,
      is_active: true,
      created_at: category.created_at,
    });
  });
});
