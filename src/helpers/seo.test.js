import { absoluteUrl, bcp47, compact, isoDuration, seoText, SITE_URL } from './seo';

describe('seo helpers', () => {
  test('isoDuration', () => {
    expect(isoDuration(3674)).toBe('PT1H1M14S');
    expect(isoDuration(60)).toBe('PT1M');
    expect(isoDuration(7200)).toBe('PT2H');
    expect(isoDuration(5)).toBe('PT5S');
    expect(isoDuration(0)).toBeUndefined();
    expect(isoDuration(undefined)).toBeUndefined();
  });

  test('seoText strips html and cuts on a word boundary', () => {
    expect(seoText('<p>Hello   <b>world</b></p>')).toBe('Hello world');
    const long = 'word '.repeat(100);
    const out  = seoText(long, 50);
    expect(out.length).toBeLessThanOrEqual(50);
    expect(out.endsWith('word…')).toBe(true);
  });

  test('absoluteUrl', () => {
    expect(absoluteUrl('en', '/lessons/cu/x', '?c=1')).toBe(`${SITE_URL}en/lessons/cu/x?c=1`);
    expect(absoluteUrl('he')).toBe(`${SITE_URL}he/`);
  });

  test('bcp47 maps ua to uk', () => {
    expect(bcp47('ua')).toBe('uk');
    expect(bcp47('he')).toBe('he');
  });

  test('compact drops empty values', () => {
    expect(compact({ a: 1, b: undefined, c: '', d: [], e: { f: null }, g: [{ h: 2, i: null }] }))
      .toEqual({ a: 1, e: {}, g: [{ h: 2 }] });
  });
});
