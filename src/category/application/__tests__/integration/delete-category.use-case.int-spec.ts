import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { CategorySequelizeRepository } from "../../../../shared/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../shared/infra/db/sequelize/category.model";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/category.entity";
import { DeleteCategoryUsecase } from "../../delete-category.usecase";

describe("Delete Category Usecase Unit Tests", () => {
  let repository: CategorySequelizeRepository;
  let usecase: DeleteCategoryUsecase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    usecase = new DeleteCategoryUsecase(repository);
  });

  it("should throw a error when category not found", async () => {
    const uuid = new Uuid();
    await expect(usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await usecase.execute({
      id: category.category_id.id,
    });

    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
