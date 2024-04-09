import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('Create Category Use Case Unit Test', () => {
  let usecase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new CreateCategoryUseCase(repository);
  });

  it('should throw an error when category is not valid', async () => {
    const input = { name: 't'.repeat(256) };
    await expect(() => usecase.execute(input)).rejects.toThrowError(
      'Entity Validation Error',
    );
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await usecase.execute({
      name: 'test',
    });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toMatchObject({
      id: repository.items[0].category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });

    output = await usecase.execute({
      name: 'test',
      description: 'test description',
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toMatchObject({
      id: repository.items[1].category_id.id,
      name: 'test',
      description: 'test description',
      is_active: true,
      created_at: repository.items[1].created_at,
    });
  });
});
