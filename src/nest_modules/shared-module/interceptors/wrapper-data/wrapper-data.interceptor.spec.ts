import { WrapperDataInterceptor } from './wrapper-data.interceptor';
import { lastValueFrom, of } from 'rxjs';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should wrapper with data key', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });
});
