import { absoluteUrl, bcp47, canonicalPath, compact, isoDuration, seoText, SITE_URL } from './seo';

describe('seo helpers', () => {
  test('canonicalPath strips language, slashes and non-content params', () => {
    expect(canonicalPath('/en/lessons/cu/x?sstart=10s&send=20s&activeTab=sources', 'en')).toBe('lessons/cu/x');
    expect(canonicalPath('/en/lessons/cu/x/?authorised=true&utm_source=fb&fbclid=1', 'en')).toBe('lessons/cu/x');
    expect(canonicalPath('/he/search?q=zohar&page=2&language=he', 'he')).toBe('search?q=zohar&page=2');
    expect(canonicalPath('/ru/lessons/gr-abc', 'ru')).toBe('lessons/abc');
    expect(canonicalPath('/en/', 'en')).toBe('');
    expect(canonicalPath('/en', 'en')).toBe('');
    // a path that merely starts with the language letters is not a prefix
    expect(canonicalPath('/events/x', 'ev')).toBe('events/x');
  });

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

  test('seoText decodes html entities', () => {
    expect(seoText('10&nbsp;сфирот &amp; &quot;ор&quot; &#39;x&#x27;')).toBe('10 сфирот & "ор" \'x\'');
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
