import { DataType } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../../category/domain/category.aggregate';
import { setupSequelize } from '../../../testing/helpers';

describe('CategoryModel Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  test('should create a category', async () => {
    const category = Category.fake().aCategory().build();

    await CategoryModel.create({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  test('mapping props', () => {
    const attributeMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    expect(attributes).toStrictEqual([
      'category_id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    const categoryIdAttr = attributeMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributeMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
  });

  test('create', async () => {
    const arrange = {
      category_id: '30b75323-0b8f-4ead-87a4-b045ba0a0678',
      name: 'Test',
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
