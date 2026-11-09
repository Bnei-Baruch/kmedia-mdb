import { describe, expect, it } from 'vitest';
import { unitDescription } from '../AVUnit';
import { textExcerpt } from '../../../Pages/WithText/hooks/useTextExcerpt';
import { personHead } from '../../../Sections/Sources/LibraryPerson';
import { topicDescription } from '../../../Sections/Topics/helper';

const t = key => ({ 'constants.content-types.LESSON_PART': 'Lesson', 'topics.header.subtext': 'All items for a topic.' }[key] ?? '');

describe('unitDescription', () => {
  it('uses the unit description', () => {
    expect(unitDescription({ name: 'A', description: 'About A' }, t)).toBe('About A');
  });

  it('skips descriptions that repeat the title, falls back to the collection', () => {
    const unit = { name: 'A', description: 'A ', collections: { c: { name: 'Series', description: 'About the series' } } };
    expect(unitDescription(unit, t)).toBe('About the series');
  });

  it('builds "<type>, <date> — <collection>" when nothing else exists', () => {
    const unit = { name: 'A', content_type: 'LESSON_PART', film_date: '2026-11-09', collections: { c: { name: 'Daily lesson' } } };
    expect(unitDescription(unit, t)).toMatch(/^Lesson, .*2026 — Daily lesson$/);
  });
});

describe('textExcerpt', () => {
  it('drops headings and keeps the body', () => {
    expect(textExcerpt('<h1>Title</h1><p>Body text</p>')).toBe(' <p>Body text</p>');
    expect(textExcerpt(undefined)).toBe('');
  });
});

describe('personHead', () => {
  it('takes the name from <h1> without the years and the bio after it', () => {
    const { title, description } = personHead('<div><h1 class="ui header">Rabash<br><small>(1907-1991)</small></h1><p>Bio</p></div>');
    expect(title).toBe('Rabash');
    expect(description).toBe('<p>Bio</p></div>');
  });
});

describe('topicDescription', () => {
  it('joins the topic path', () => {
    expect(topicDescription([{ content: 'Topics' }, { content: 'Unity' }], t)).toBe('Topics › Unity. All items for a topic.');
  });
});
