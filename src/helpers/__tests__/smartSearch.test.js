import { describe, expect, it } from 'vitest';

import { FN_CONTENT_TYPE, FN_DATE_FILTER, FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../consts';
import { appendMention, applyParsedFilters, chipKey, groupSuggestions, removeMention } from '../smartSearch';

describe('smartSearch helpers', () => {
  it('maps parser filters to filter values and keeps existing ones', () => {
    const { filters, meta, unused } = applyParsedFilters({ [FN_SOURCES_MULTI]: ['bs'] }, [
      { slot: 'content_type', value: 'LESSON_PART', path: 'Урок', mention: 'уроки' },
      { slot: 'source', value: 'bs', path: 'Бааль Сулам', mention: 'бааль сулам' },
      { slot: 'part', value: 3, mention: 'часть 3' }
    ]);

    expect(filters[FN_CONTENT_TYPE]).toEqual(['LESSON_PART']);
    expect(filters[FN_SOURCES_MULTI]).toEqual(['bs']);
    expect(meta[chipKey(FN_CONTENT_TYPE, 'LESSON_PART')]).toMatchObject({ mention: 'уроки', label: 'Урок' });
    expect(unused.map(f => f.mention)).toEqual(['часть 3']);
  });

  it('merges several years into one date range', () => {
    const { filters } = applyParsedFilters({}, [
      { slot: 'date', value: { year: 2022 }, mention: '2022' },
      { slot: 'date', value: { year: 2020 }, mention: '2020' }
    ]);

    const [{ from, to }] = filters[FN_DATE_FILTER];
    expect(from.getFullYear()).toBe(2020);
    expect([to.getFullYear(), to.getMonth(), to.getDate()]).toEqual([2022, 11, 31]);
  });

  it('groups suggestions by mention, dedups same paths and skips applied values', () => {
    const groups = groupSuggestions([
      { slot: 'source', value: 'A', path: 'Рашби › Зоар', mention: 'зоар' },
      { slot: 'collection', value: 'C1', path: 'Зоар', mention: 'зоар' },
      { slot: 'collection', value: 'C2', path: 'Зоар', mention: 'зоар' },
      { slot: 'topic', value: 'T', path: 'Поручительство', mention: 'поручительство' }
    ], { [FN_TOPICS_MULTI]: ['T'] });

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map(i => i.value)).toEqual(['A', 'C1']);
  });

  it('removes and appends mentions as whole words', () => {
    expect(removeMention('зоар зоара 2024', 'зоар')).toBe('зоара 2024');
    expect(removeMention('בזוהר זוהר', 'זוהר')).toBe('בזוהר');
    expect(appendMention('', 'зоар')).toBe('зоар');
  });
});
