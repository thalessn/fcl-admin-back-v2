import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CastMemberOutput } from 'src/core/cast-member/application/common/cast-member-output';
import { CreateCastMemberUseCase } from 'src/core/cast-member/application/create-cast-member/create-cast-member.use-case';
import { DeleteCastMemberUseCase } from 'src/core/cast-member/application/delete-cast-member/delete-cast-member.use-case';
import { GetCastMemberUseCase } from 'src/core/cast-member/application/get-cast-member/get-cast-member.use-case';
import { ListCastMembersUseCase } from 'src/core/cast-member/application/list-cast-members/list-cast-members.use-case';
import { UpdateCastMemberInput } from 'src/core/cast-member/application/update-cast-member/update-cast-member.input';
import { UpdateCastMemberUseCase } from 'src/core/cast-member/application/update-cast-member/update-cast-member.use-case';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './cast-member.presenter';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { SearchCastMemberDto } from './dto/search-cast-members.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';

@Controller('cast-members')
export class CastMembersController {
  @Inject(CreateCastMemberUseCase)
  private createUseCase: CreateCastMemberUseCase;

  @Inject(UpdateCastMemberUseCase)
  private updateUseCase: UpdateCastMemberUseCase;

  @Inject(DeleteCastMemberUseCase)
  private deleteUseCase: DeleteCastMemberUseCase;

  @Inject(GetCastMemberUseCase)
  private getUseCase: GetCastMemberUseCase;

  @Inject(ListCastMembersUseCase)
  private listUseCase: ListCastMembersUseCase;

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(createCastMemberDto);
    return CastMembersController.serialize(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCastMemberDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new CastMemberCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return CastMembersController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const input = new UpdateCastMemberInput({ id, ...updateCastMemberDto });
    const output = await this.updateUseCase.execute(input);
    return CastMembersController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static serialize(output: CastMemberOutput) {
    return new CastMemberPresenter(output);
  }
}
