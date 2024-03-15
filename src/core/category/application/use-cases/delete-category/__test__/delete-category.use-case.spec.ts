import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/category-in-memory.repository";
import { DeleteCategoryUsecase } from "../delete-category.usecase";

describe("Delete Category Use Case Unit Tests", () => {
  let repository: CategoryInMemoryRepository;
  let usecase: DeleteCategoryUsecase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new DeleteCategoryUsecase(repository);
  });

  it("should throw an error when entity not found", async () => {
    await expect(() => usecase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError()
    );

    const uuid = new Uuid();

    await expect(() => usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should delete a category", async () => {
    const category = new Category({ name: "test" });
    repository.items = [category];

    await usecase.execute({
      id: category.category_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
