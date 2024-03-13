import { Entity } from "../../../../../shared/domain/entity";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("Update Category Use Case Unit Tests", () => {
  let repository: CategoryInMemoryRepository;
  let usecase: UpdateCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new UpdateCategoryUseCase(repository);
  });

  it("should throw an error if entity not found", async () => {
    await expect(
      usecase.execute({ id: "fake_id", name: "test" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();
    await expect(
      usecase.execute({ id: uuid.id, name: "test" })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it("should throw an error when entity is not valid", async () => {
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];
    await expect(() =>
      usecase.execute({
        id: entity.category_id.id,
        name: "t".repeat(256),
      })
    ).rejects.toThrowError("Entity Validation Error");
  });

  it("should insert a category", async () => {
    const category = new Category({ name: "Test" });
    const spyUpdate = jest.spyOn(repository, "update");
    repository.items = [category];

    let output = await usecase.execute({
      id: category.category_id.id,
      name: "TEST",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: "TEST",
      description: null,
      is_active: true,
      created_at: category.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: string | null;
        is_active?: boolean | null;
      };
      expected: {
        id: string;
        name: string;
        description: string | null;
        is_active: boolean;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: category.category_id.id,
          name: "test",
          description: "some description",
        },
        expected: {
          id: category.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: "test",
          is_active: false,
        },
        expected: {
          id: category.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: "test",
          description: "new description",
          is_active: true,
        },
        expected: {
          id: category.category_id.id,
          name: "test",
          description: "new description",
          is_active: true,
          created_at: category.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await usecase.execute({
        id: i.input.id,
        ...("name" in i.input && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        id: category.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
