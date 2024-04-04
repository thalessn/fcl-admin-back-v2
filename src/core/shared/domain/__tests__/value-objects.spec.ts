import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    readonly prop1: string,
    readonly prop2: number,
  ) {
    super();
  }
}

describe('Value-Object Unit Tests', () => {
  it('should be equal', () => {
    const str1 = new StringValueObject('value1');
    const str2 = new StringValueObject('value1');
    expect(str1.equals(str2)).toBe(true);

    const complex1 = new ComplexValueObject('string1', 1);
    const complex2 = new ComplexValueObject('string1', 1);
    expect(complex1.equals(complex2)).toBe(true);
  });

  it('should not be equal', () => {
    const str1 = new StringValueObject('valor1');
    const str2 = new StringValueObject('valor2');
    expect(str1.equals(str2)).toBe(false);
    expect(str1.equals(null as any)).toBe(false);

    const complex1 = new ComplexValueObject('string1', 1);
    const complex2 = new ComplexValueObject('string1', 2);
    expect(complex1.equals(complex2)).toBe(false);
    expect(complex1.equals(null as any)).toBe(false);
  });
});
