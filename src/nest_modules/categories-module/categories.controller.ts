import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from 'src/core/category/application/use-cases/update-category/update-category.use-case';
import { ListCategoriesUseCase } from 'src/core/category/application/use-cases/list-category/list-categories.use-case';
import { DeleteCategoryUsecase } from 'src/core/category/application/use-cases/delete-category/delete-category.usecase';
import { GetCategoryUsecase } from 'src/core/category/application/use-cases/get-category/get-category.use-case';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listCategoriesUseCase: ListCategoriesUseCase;

  @Inject(DeleteCategoryUsecase)
  private deleteCategoryUseCase: DeleteCategoryUsecase;

  @Inject(GetCategoryUsecase)
  private getCategoryUseCase: GetCategoryUsecase;

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
