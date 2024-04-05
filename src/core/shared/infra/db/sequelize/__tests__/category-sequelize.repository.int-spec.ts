import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { CategoryModel } from '../category.model';
import {
  Category,
  CategoryId,
} from '../../../../../category/domain/category.aggregate';
import { NotFoundError } from '../../../../domain/errors/not-found.error';
import { CategoryModelMapper } from '../../../../../category/infra/db/sequelize/category-model-mapper';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../../category/domain/category.repository';
import { SearchResult } from '../../../../domain/repository/search-result';
import { SearchParams } from '../../../../domain/repository/search-params';
import { setupSequelize } from '../../../testing/helpers';

describe('Category Sequelize Repository Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should insert a new category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model!.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it('should finds a entity by id', async () => {
    let modelFound = await repository.findById(new CategoryId());
    expect(modelFound).toBeNull();

    const category = Category.fake().aCategory().build();
    repository.insert(category);

    modelFound = await repository.findById(category.category_id);
    expect(modelFound!.toJSON()).toMatchObject(category.toJSON());
  });

  it('should return all categories', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const categories = await repository.findAll();
    expect(categories).toHaveLength(1);
    expect(JSON.stringify(categories)).toBe(JSON.stringify([category]));
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName('Test');
    await repository.update(category);

    const updatedCategory = await repository.findById(category.category_id);
    expect(updatedCategory!.name).toBe(category.name);
    expect(updatedCategory!.toJSON()).toMatchObject(category.toJSON());
  });

  it('should throw a error on update when category not found', async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category),
    );
  });

  it('should throw a error on delete when a category not found', async () => {
    const categoryId = new CategoryId();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category),
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await repository.delete(category.category_id);

    const categoryDeleted = await repository.findById(category.category_id);
    expect(categoryDeleted).toBeNull();
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName('Test')
        .withDescription(null)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.category_id).toBeDefined();
      });

      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Test',
          description: null,
          is_active: true,
          created_at: created_at,
        }),
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Test ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      await repository.bulkInsert(categories);

      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items.map((item) => item.toJSON());
      [...items].reverse().forEach((item, index) => {
        expect(item.name).toBe(`Test ${index + 1}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST',
        }),
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          current_page: 1,
          per_page: 2,
          total: 3,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          current_page: 2,
          per_page: 2,
          total: 3,
        }).toJSON(true),
      );
    });

    describe('should search using paginate, sort and filter', () => {
      const categories = [
        Category.fake().aCategory().withName('test').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('TEST').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
