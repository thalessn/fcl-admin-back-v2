import { getModelToken } from '@nestjs/sequelize';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/use-cases/list-category/list-categories.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { ICategoryRepository } from '../../core/category/domain/category.repository';
import { GetCategoryUsecase } from 'src/core/category/application/use-cases/get-category/get-category.use-case';
import { DeleteCategoryUsecase } from 'src/core/category/application/use-cases/delete-category/delete-category.usecase';
import { CategoryInMemoryRepository } from '../../core/category/infra/category-in-memory.repository';
import { CategorySequelizeRepository } from '../../core/shared/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../core/shared/infra/db/sequelize/category.model';

export const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository,
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel);
    },
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new CreateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new UpdateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListCategoriesUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new ListCategoriesUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUsecase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new GetCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUsecase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new DeleteCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
