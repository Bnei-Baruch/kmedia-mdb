import dayjs from './dayjs';
import { today } from './date';
import {
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE,
  FN_DATE_FILTER,
  FN_LANGUAGES,
  FN_LOCATIONS,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_PERSON,
  FN_PUBLISHER,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI
} from './consts';

// Smart search: natural-language query → filters (smart-search service, POST /parse).
// Slots of the parser response mapped to filter names of the 'search' namespace.
export const SLOT_TO_FILTER = {
  content_type     : FN_CONTENT_TYPE,
  media_type       : FN_MEDIA_TYPE,
  language         : FN_LANGUAGES,
  original_language: FN_ORIGINAL_LANGUAGES,
  date             : FN_DATE_FILTER,
  source           : FN_SOURCES_MULTI,
  topic            : FN_TOPICS_MULTI,
  person           : FN_PERSON,
  collection       : FN_COLLECTION_MULTI,
  location         : FN_LOCATIONS,
  publisher        : FN_PUBLISHER
};

export const SMART_NAMESPACE = 'search';

const RELATIVE_DATES = {
  today     : () => [today(), today()],
  yesterday : () => [today().subtract(1, 'day'), today().subtract(1, 'day')],
  this_week : () => [today().startOf('week'), today()],
  last_week : () => [today().subtract(1, 'week').startOf('week'), today().subtract(1, 'week').endOf('week')],
  this_month: () => [today().startOf('month'), today()],
  last_month: () => [today().subtract(1, 'month').startOf('month'), today().subtract(1, 'month').endOf('month')],
  this_year : () => [today().startOf('year'), today()],
  last_year : () => [today().subtract(1, 'year').startOf('year'), today().subtract(1, 'year').endOf('year')]
};

// Parser date value ({year} | {from,to} | {relative}) → [from, to] dayjs, or null if unknown.
const dateValueToRange = value => {
  if (!value) return null;

  if (value.year) {
    const y = dayjs(`${value.year}-01-01`);
    return [y.startOf('year'), y.endOf('year')];
  }

  if (value.from || value.to) {
    return [dayjs(value.from || value.to), dayjs(value.to || value.from)];
  }

  return RELATIVE_DATES[value.relative]?.() || null;
};

// Several date mentions ("2020 2022") collapse into one range covering all of them.
const mergeDateRanges = values => {
  const ranges = values.map(dateValueToRange).filter(Boolean);
  if (!ranges.length) return null;

  const from = ranges.reduce((acc, [f]) => (f.isBefore(acc) ? f : acc), ranges[0][0]);
  const to   = ranges.reduce((acc, [, t]) => (t.isAfter(acc) ? t : acc), ranges[0][1]);
  return { from: from.startOf('day').toDate(), to: to.startOf('day').toDate() };
};

export const chipKey = (name, value) => `${name}:${typeof value === 'object' ? JSON.stringify(value) : value}`;

export const isMappedSlot = slot => !!SLOT_TO_FILTER[slot];

/**
 * Merges recognized parser filters into the current filters of the namespace.
 * @param current {Object} filter name → values
 * @param parsed {Array} parser filters
 * @returns {{ filters: Object, meta: Object, unused: Array }}
 *   filters — new filter name → values; meta — chipKey → { mention, label, slot } for chip labels/editing;
 *   unused — parsed items that could not be applied (their mention must stay in the text).
 */
export const applyParsedFilters = (current, parsed) => {
  const filters = Object.fromEntries(Object.entries(current).map(([k, v]) => [k, [...v]]));
  const meta    = {};
  const unused  = [];
  const dates   = [];

  parsed.forEach(f => {
    const name = SLOT_TO_FILTER[f.slot];
    if (!name) {
      unused.push(f);
      return;
    }

    if (name === FN_DATE_FILTER) {
      dateValueToRange(f.value) ? dates.push(f) : unused.push(f);
      return;
    }

    const values = filters[name] || [];
    if (!values.includes(f.value)) {
      values.push(f.value);
    }

    filters[name]                = values;
    meta[chipKey(name, f.value)] = { mention: f.mention, label: f.path, slot: f.slot };
  });

  if (dates.length) {
    const range = mergeDateRanges(dates.map(f => f.value));

    filters[FN_DATE_FILTER]                = [range];
    meta[chipKey(FN_DATE_FILTER, range)] = { mention: dates.map(f => f.mention).join(' '), slot: 'date' };
  }

  return { filters, meta, unused };
};

/**
 * Suggestions grouped by mention, without duplicates (several collections share the same name)
 * and without values that are already applied.
 */
export const groupSuggestions = (suggestions, appliedFilters) => {
  const groups = [];
  const seen   = new Set();

  suggestions.forEach(s => {
    const name = SLOT_TO_FILTER[s.slot];
    if (!name || appliedFilters[name]?.includes(s.value)) return;

    const dedupKey = `${s.slot}:${s.path}`;
    if (seen.has(dedupKey)) return;
    seen.add(dedupKey);

    let group = groups.find(g => g.mention === s.mention);
    if (!group) {
      group = { mention: s.mention, items: [] };
      groups.push(group);
    }

    group.items.push({ ...s, name });
  });

  return groups;
};

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const removeMention = (text, mention) => {
  if (!mention) return text;

  const re = new RegExp(`(^|\\s)${escapeRegExp(mention)}(?=\\s|$)`, 'iu');
  return text.replace(re, ' ').replace(/\s+/g, ' ').trim();
};

export const appendMention = (text, mention) => [text, mention].filter(Boolean).join(' ').trim();
