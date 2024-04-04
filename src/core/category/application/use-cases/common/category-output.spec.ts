import { Category } from '../../../domain/category.entity';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutputMapperOutput Unit Test', () => {
  it('should convert an category in output object', () => {
    const category = Category.create({ name: 'Test' });
    const spyToJSON = jest.spyOn(category, 'toJSON');
    const output = CategoryOutputMapper.toOutput(category);

    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: 'Test',
      description: null,
      is_active: true,
      created_at: category.created_at,
    });
  });
});
