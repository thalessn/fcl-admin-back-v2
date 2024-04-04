import { InvalidUuidError, Uuid } from '../uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('UUID Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  it('should throw error with invalid uuid', () => {
    expect(() => {
      new Uuid('invalid id');
    }).toThrowError(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a valid uuid', () => {
    const uuid = new Uuid('e89061e2-f3de-4d29-9b95-ad5389046406');
    expect(uuid.id).toBeDefined();
    expect(uuid.id).toBe('e89061e2-f3de-4d29-9b95-ad5389046406');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should generate a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
