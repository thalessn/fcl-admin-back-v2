import { CategoryId } from 'src/core/category/domain/category.aggregate';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { ICategoryRepository } from '../../../domain/category.repository';

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutPut>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const uuid = new CategoryId(input.id);
    await this.categoryRepo.delete(uuid);
  }
}

type DeleteCategoryInput = {
  id: string;
};

type DeleteCategoryOutPut = void;
