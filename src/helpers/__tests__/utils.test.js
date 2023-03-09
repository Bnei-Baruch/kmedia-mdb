import { isEmpty } from '../utils';
/* eslint no-use-before-define: 0 */
describe('isEmpty', () => {
  test('object', () => {
    {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ 'a': 1 })).toBe(false);
    }

    {
      const a = {};
      expect(isEmpty(a)).toBe(true);
      a.a = 1;
      expect(isEmpty(a)).toBe(false);
      delete a.a;
      expect(isEmpty(a)).toBe(true);
    }
  });

  test('array', () => {
    {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    }

    {
      const a = [];
      expect(isEmpty(a)).toBe(true);
      a.push(1);
      expect(isEmpty(a)).toBe(false);
      a.pop();
      expect(isEmpty(a)).toBe(true);
    }
  });

  test('null', () => {
    expect(isEmpty(null)).toBe(true);
    const a = null;
    expect(isEmpty(a)).toBe(true);
  });

  test('undefined', () => {
    {
      let a;
      expect(isEmpty(a)).toBe(true);
    }

    {
      const a = { b: 'aaa' };
      expect(isEmpty(a.b)).toBe(false);
      expect(isEmpty(a.a)).toBe(true);
      delete a.b;
      expect(isEmpty(a.b)).toBe(true);
    }

    {
      const a = ['aaa'];
      expect(isEmpty(a[0])).toBe(false);
      expect(isEmpty(a[1])).toBe(true);
      a.pop();
      expect(isEmpty(a[0])).toBe(true);
    }
  });

  test('object with length (string)', () => {
    expect(isEmpty('aaa')).toBe(false);
    const a = String();
    expect(isEmpty(a)).toBe(true);
    expect(isEmpty('')).toBe(true);

  });
});
