import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../infra/category-in-memory.repository';
import { DeleteCategoryUsecase } from '../delete-category.usecase';

describe('Delete Category Use Case Unit Tests', () => {
  let repository: CategoryInMemoryRepository;
  let usecase: DeleteCategoryUsecase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new DeleteCategoryUsecase(repository);
  });

  it('should throw an error when entity not found', async () => {
    await expect(() => usecase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new CategoryId();

    await expect(() => usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    );
  });

  it('should delete a category', async () => {
    const category = new Category({ name: 'test' });
    repository.items = [category];

    await usecase.execute({
      id: category.category_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
