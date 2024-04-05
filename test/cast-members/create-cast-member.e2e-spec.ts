import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { CastMemberOutputMapper } from '../../src/core/cast-member/application/common/cast-member-output';
import { CastMemberId } from '../../src/core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { CastMembersController } from '../../src/nest_modules/cast-members-module/cast-member-controllers';
import { CAST_MEMBERS_PROVIDERS } from '../../src/nest_modules/cast-members-module/cast-member.providers';
import { CreateCastMemberFixture } from '../../src/nest_modules/cast-members-module/testing/cast-member-fixtures';
import { startApp } from '../../src/nest_modules/shared-module/testing/helpers';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members (POST)', () => {
    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = CreateCastMemberFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/cast-members')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp();
      const validationError =
        CreateCastMemberFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/cast-members')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a cast member', () => {
      const app = startApp();
      const arrange = CreateCastMemberFixture.arrangeForCreate();
      let castMemberRepo: ICastMemberRepository;
      beforeEach(async () => {
        castMemberRepo = app.app.get<ICastMemberRepository>(
          CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(app.app.getHttpServer())
            .post('/cast-members')
            .send(send_data)
            .expect(201);

          const keyInResponse = CreateCastMemberFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const castMemberCreated = await castMemberRepo.findById(
            new CastMemberId(id),
          );
          const presenter = CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(castMemberCreated!),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
