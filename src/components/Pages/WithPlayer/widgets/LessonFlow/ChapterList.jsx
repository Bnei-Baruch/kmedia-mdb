import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CHAPTER_FILTERS, chapterColor, chapterLabel, formatChapterTime } from './helper';
import { seekToChapter, seekToTime } from './actions';
import { noop } from '../../../../../helpers/utils';

// programmatic (auto) scroll is ignored by the "user scrolled" detection for this long
const AUTO_SCROLL_GRACE_MS = 800;

const FilterChips = ({ chapters, filter, setFilter }) => {
  const { t } = useTranslation();

  const present = useMemo(() => new Set(chapters.map(c => c.type)), [chapters]);
  const keys    = Object.keys(CHAPTER_FILTERS)
    .filter(k => k === 'all' || CHAPTER_FILTERS[k].some(type => present.has(type)));

  // only "all" left -> nothing to filter
  if (keys.length < 3) return null;

  return (
    <div className="flex flex-wrap gap-1 px-2 pt-2 pb-1">
      {
        keys.map(k => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full border px-2 py-0.5 text-xs ${filter === k
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            {t(`lesson-flow.filters.${k}`)}
          </button>
        ))
      }
    </div>
  );
};

const STUDENT = 'תלמיד';

// the chapter's paragraphs with text, in order
export const chapterParagraphs = (chapter, paragraphs) => {
  const items = [];
  for (let i = chapter.p_start; i <= chapter.p_end; i++) if (paragraphs[i]) items.push(paragraphs[i]);
  return items;
};

// question / answer chain: runs of one speaker; a student's run is a question (the first) or a follow-up
const qaTurns = items => {
  const turns = [];
  items.forEach(p => {
    const asks = p.speaker === STUDENT;
    const last = turns[turns.length - 1];
    if (last && last.asks === asks) last.items.push(p);
    else turns.push({ asks, items: [p] });
  });
  let questions = 0;
  turns.forEach(turn => {
    turn.role = turn.asks ? (questions++ === 0 ? 'question' : 'follow-up') : 'answer';
  });
  return turns;
};

export const questionCount = items => qaTurns(items).filter(x => x.asks).length;

// "to the text" and "copy a link to this moment" of a paragraph / chapter
const LinkActions = ({ link, i, time }) => {
  const { t }               = useTranslation();
  const [copied, setCopied] = useState(false);
  if (!link?.enabled) return null;

  const copy = () => {
    const url = link.shareUrl(i, time);
    if (!url) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    navigator.clipboard?.writeText(url).then(done, () => {});
  };

  const cls = 'shrink-0 px-1.5 py-1 text-xs text-gray-400 hover:text-blue-700';
  return (
    <span className="flex shrink-0 items-start pt-1">
      <button type="button" data-no-follow="1" className={cls} title={t('lesson-flow.to-text')}
        onClick={() => link.toText(i)}>
        <span aria-hidden="true">¶</span><span className="sr-only">{t('lesson-flow.to-text')}</span>
      </button>
      <button type="button" data-no-follow="1" className={cls} title={t('lesson-flow.copy-link')} onClick={copy}>
        {copied ? <span className="text-green-700">✓</span> : <span aria-hidden="true">🔗</span>}
        <span className="sr-only">{t('lesson-flow.copy-link')}</span>
      </button>
    </span>
  );
};

const Paragraph = ({ p, active, showSpeaker, link }) => (
  <div className={`group flex items-start hover:bg-gray-100 ${active ? 'bg-yellow-50' : ''}`}>
    <button
      type="button"
      data-pi={p.i}
      onClick={() => seekToTime(p.start)}
      className="block min-w-0 flex-1 px-3 py-1.5 text-start text-sm leading-relaxed"
    >
      {showSpeaker && p.speaker && <span className="me-2 text-xs font-medium text-gray-500">{p.speaker}:</span>}
      <span dir="auto">{p.text}</span>
    </button>
    <span className={active ? '' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}>
      <LinkActions link={link} i={p.i} time={p.start} />
    </span>
  </div>
);

// The chapter's text: who speaks and what; for a question, the question / answer chain.
// The playing paragraph is highlighted, a click plays from it.
const ChapterText = ({ chapter, paragraphs, activePi, link }) => {
  const { t } = useTranslation();
  const items = chapterParagraphs(chapter, paragraphs);
  if (items.length === 0) return <div className="px-4 pb-3 text-xs text-gray-500">{t('lesson-flow.no-text')}</div>;

  const border = { borderColor: chapterColor(chapter.type) };
  if (chapter.type !== 'qa') {
    return (
      <div className="border-s-2 ms-5 me-2 mb-2" style={border}>
        {items.map(p => <Paragraph key={p.i} p={p} active={p.i === activePi} showSpeaker link={link} />)}
      </div>
    );
  }

  return (
    <div className="ms-5 me-2 mb-2 flex flex-col gap-1">
      {
        qaTurns(items).map(turn => (
          <div
            key={turn.items[0].i}
            className={`border-s-2 ${turn.asks ? 'bg-amber-50/60' : 'ms-3'}`}
            style={turn.asks ? border : { borderColor: chapterColor('commentary') }}
          >
            <div className="px-3 pt-1 text-xs font-semibold text-gray-600">{t(`lesson-flow.qa.${turn.role}`)}</div>
            {turn.items.map(p => <Paragraph key={p.i} p={p} active={p.i === activePi} link={link} />)}
          </div>
        ))
      }
    </div>
  );
};

const ChapterRow = memo(({ chapter, idx, active, label, expanded, onToggle, paragraphs, activePi, link }) => {
  const { t } = useTranslation();
  const items     = useMemo(() => chapterParagraphs(chapter, paragraphs), [chapter, paragraphs]);
  const hasText   = items.length > 0;
  const questions = chapter.type === 'qa' ? questionCount(items) : 0;

  return (
    <li data-idx={idx}>
      <div className={`flex items-start ${active ? 'bg-yellow-50' : ''}`}>
        <button
          type="button"
          onClick={() => seekToChapter(chapter)}
          className={`flex min-w-0 flex-1 items-start gap-2 px-3 py-2 text-start ${active ? 'hover:bg-yellow-100' : 'hover:bg-gray-100'}`}
          aria-current={active ? 'true' : undefined}
        >
          <span className="w-12 shrink-0 pt-0.5 font-mono text-xs text-gray-500" dir="ltr">
            {formatChapterTime(chapter.start)}
          </span>
          <span
            className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: chapterColor(chapter.type) }}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className={`block text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
              {label}
              {questions > 1 && <span className="ms-1 text-xs font-normal text-gray-500">×{questions}</span>}
            </span>
            {
              chapter.title && !expanded && (
                <span className="block truncate text-xs text-gray-500" dir="auto" title={chapter.title}>
                  {chapter.title}
                </span>
              )
            }
          </span>
        </button>
        {hasText && <LinkActions link={link} i={items[0].i} time={chapter.start} />}
        {
          hasText && (
            <button
              type="button"
              data-no-follow="1"
              onClick={() => onToggle(idx, !expanded)}
              aria-expanded={expanded}
              title={t(expanded ? 'lesson-flow.hide-text' : 'lesson-flow.show-text')}
              className="shrink-0 px-3 py-2 text-lg leading-none text-gray-500 hover:text-gray-900"
            >
              <span className={`inline-block transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
            </button>
          )
        }
      </div>
      {expanded && <ChapterText chapter={chapter} paragraphs={paragraphs} activePi={activePi} link={link} />}
    </li>
  );
});

ChapterRow.displayName = 'ChapterRow';

/**
 * Chapters of a lesson; highlights the current one and follows it while playing.
 * Manual scroll stops following; "to current" button resumes.
 */
const EMPTY = {};

// index of the paragraph playing at `time` among the chapter's ones; null if none
const findParagraph = (chapter, paragraphs, time) => {
  if (!chapter) return null;
  let res = null;
  for (let i = chapter.p_start; i <= chapter.p_end; i++) {
    const p = paragraphs[i];
    if (p && p.start <= time) res = i;
  }

  return res;
};

const ChapterList = ({ chapters, currentIdx, time = 0, paragraphs = EMPTY, link = null, className = '' }) => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState('all');
  const [follow, setFollow] = useState(true);
  // idx -> expanded by the user; the playing chapter is expanded unless the user closed it
  const [toggled, setToggled] = useState({});
  const onToggle = useCallback((idx, value) => setToggled(prev => ({ ...prev, [idx]: value })), []);
  const isExpanded = idx => toggled[idx] ?? idx === currentIdx;
  const activePi   = findParagraph(chapters[currentIdx], paragraphs, time);

  const scrollRef      = useRef(null);
  const autoScrollTill = useRef(0);

  const visible = CHAPTER_FILTERS[filter] || CHAPTER_FILTERS.all;

  const scrollToCurrent = (behavior = 'smooth') => {
    const box = scrollRef.current;
    const el  = box?.querySelector(`[data-pi="${activePi}"]`) || box?.querySelector(`[data-idx="${currentIdx}"]`);
    if (!box || !el) return;

    const top = el.offsetTop - (box.clientHeight / 3);
    autoScrollTill.current = Date.now() + AUTO_SCROLL_GRACE_MS;
    box.scrollTo({ top: Math.max(0, top), behavior });
  };

  useLayoutEffect(() => {
    if (follow && currentIdx >= 0) scrollToCurrent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, activePi, follow, filter]);

  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return noop;
    const onScroll = () => {
      if (Date.now() > autoScrollTill.current) setFollow(false);
    };

    box.addEventListener('scroll', onScroll, { passive: true });
    return () => box.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelect = e => {
    // clicking a chapter returns to "follow" mode
    const btn = e.target.closest('button');
    if (btn && !btn.dataset.noFollow) setFollow(true);
  };

  return (
    <div className={`relative flex min-h-0 flex-col ${className}`}>
      <FilterChips chapters={chapters} filter={filter} setFilter={setFilter} />
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        <ul className="m-0 list-none p-0" onClick={handleSelect}>
          {
            chapters.map((c, idx) => visible.includes(c.type) && (
              <ChapterRow
                key={idx}
                idx={idx}
                chapter={c}
                active={idx === currentIdx}
                label={chapterLabel(t, c, idx)}
                expanded={isExpanded(idx)}
                onToggle={onToggle}
                paragraphs={paragraphs}
                activePi={idx === currentIdx ? activePi : null}
                link={link}
              />
            ))
          }
        </ul>
      </div>
      {
        !follow && currentIdx >= 0 && (
          <button
            type="button"
            onClick={() => setFollow(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs text-white shadow hover:bg-blue-700"
          >
            ↓ {t('lesson-flow.to-current')}
          </button>
        )
      }
    </div>
  );
};

export default ChapterList;
