import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../../category/domain/category.entity";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../domain/errors/not-found.error";

describe("Category Sequelize Repository Integration Tests", () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it("should finds a entity by id", async () => {
    let modelFound = await repository.findById(new Uuid());
    expect(modelFound).toBeNull();

    const category = Category.fake().aCategory().build();
    repository.insert(category);

    modelFound = await repository.findById(category.category_id);
    expect(modelFound.toJSON()).toMatchObject(category.toJSON());
  });

  it("should return all categories", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const categories = await repository.findAll();
    expect(categories).toHaveLength(1);
    expect(JSON.stringify(categories)).toBe(JSON.stringify([category]));
  });

  it("should update a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName("Test");
    await repository.update(category);

    const updatedCategory = await repository.findById(category.category_id);
    expect(updatedCategory.name).toBe(category.name);
    expect(updatedCategory.toJSON()).toMatchObject(category.toJSON());
  });

  it("should throw a error on update when category not found", async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category)
    );
  });

  it("should throw a error on delete when a category not found", async () => {
    const categoryId = new Uuid();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    );
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await repository.delete(category.category_id);

    const categoryDeleted = await repository.findById(category.category_id);
    expect(categoryDeleted).toBeNull();
  });
});
