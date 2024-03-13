import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../domain/validators/validation.error";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { Category } from "../../../../../category/domain/category.entity";
import { setupSequelize } from "../../../testing/helpers";

describe("CategoryModelMapper Integration Test", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throw error when category is invalid", () => {
    expect.assertions(2);
    const model = CategoryModel.build({
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "a".repeat(256),
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it needs throw a EntityValidationError");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    }
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "3c2964e1-c6d8-4d9d-bb68-1f83a0d2f388",
      name: "Test",
      description: "some description",
      is_active: true,
      created_at,
    });

    const category = CategoryModelMapper.toEntity(model);
    expect(category.toJSON()).toStrictEqual({
      category_id: "3c2964e1-c6d8-4d9d-bb68-1f83a0d2f388",
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at,
    });
  });

  it("should covert a category entity to a category model", () => {
    const category = Category.fake().aCategory().build();

    const categoryModel = CategoryModelMapper.toModel(category);

    expect(categoryModel.toJSON()).toMatchObject(category.toJSON());
  });
});
