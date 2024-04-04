import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { CategorySequelizeRepository } from '../../../../../shared/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../shared/infra/db/sequelize/category.model';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('Create Category Use Case Integration Tests', () => {
  let repository: CategorySequelizeRepository;
  let usecase: CreateCategoryUseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    usecase = new CreateCategoryUseCase(repository);
  });

  it('should insert a category', async () => {
    let output = await usecase.execute({
      name: 'test',
    });
    let categoryInserted = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: categoryInserted.category_id.id,
      name: categoryInserted.name,
      description: null,
      is_active: true,
      created_at: categoryInserted.created_at,
    });

    output = await usecase.execute({
      name: 'test',
      description: 'test description',
    });
    categoryInserted = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: categoryInserted.category_id.id,
      name: 'test',
      description: 'test description',
      is_active: true,
      created_at: categoryInserted.created_at,
    });

    output = await usecase.execute({
      name: 'test',
      description: 'test description',
      is_active: false,
    });
    categoryInserted = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: categoryInserted.category_id.id,
      name: 'test',
      description: 'test description',
      is_active: false,
      created_at: categoryInserted.created_at,
    });

    output = await usecase.execute({
      name: 'test',
      is_active: false,
    });
    categoryInserted = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: categoryInserted.category_id.id,
      name: 'test',
      description: null,
      is_active: false,
      created_at: categoryInserted.created_at,
    });
  });
});
