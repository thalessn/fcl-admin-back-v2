import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../shared/domain/value-objects/uuid.vo";
import { CategorySequelizeRepository } from "../../../../shared/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../shared/infra/db/sequelize/category.model";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/category.entity";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("Update Category UseCase Integration Tests", () => {
  let repository: CategorySequelizeRepository;
  let usecase: UpdateCategoryUseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    usecase = new UpdateCategoryUseCase(repository);
  });

  it("should throw an error when entity not found", async () => {
    await expect(usecase.execute({ id: "fake_id" })).rejects.toThrow(
      new InvalidUuidError()
    );

    const uuid = new Uuid();
    await expect(
      usecase.execute({ id: uuid.id, name: "test" })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it("should insert a category", async () => {
    const category = new Category({ name: "Test" });
    await repository.insert(category);

    let output = await usecase.execute({
      id: category.category_id.id,
      name: "TEST",
    });
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
