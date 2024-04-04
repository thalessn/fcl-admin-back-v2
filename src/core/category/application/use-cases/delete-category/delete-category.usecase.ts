import { IUseCase } from '../../../../shared/application/use-case.interface';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { ICategoryRepository } from '../../../domain/category.repository';

export class DeleteCategoryUsecase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutPut>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const uuid = new Uuid(input.id);
    await this.categoryRepo.delete(uuid);
  }
}

type DeleteCategoryInput = {
  id: string;
};

type DeleteCategoryOutPut = void;
