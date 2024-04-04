import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../infra/category-in-memory.repository';
import { GetCategoryUsecase } from '../get-category.use-case';

describe('Get Category Use Case Unit Test', () => {
  let repository: CategoryInMemoryRepository;
  let usecase: GetCategoryUsecase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new GetCategoryUsecase(repository);
  });

  it('should throw an error when entity not found', async () => {
    await expect(usecase.execute({ id: 'fake_id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new CategoryId();
    await expect(
      usecase.execute({
        id: uuid.id,
      }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    repository.items = [category];

    const categoryFound = await usecase.execute({
      id: category.category_id.id,
    });
    expect(categoryFound).toStrictEqual({
      id: repository.items[0].category_id.id,
      name: repository.items[0].name,
      description: repository.items[0].description,
      is_active: repository.items[0].is_active,
      created_at: repository.items[0].created_at,
    });
  });
});
