// Lesson markup (chapters / paragraph timings) produced by the ai-trns service.

export const CHAPTER_TYPES = ['reading', 'commentary', 'qa', 'other'];

// One place for chapter colors (list dots + player progress bar segments)
export const CHAPTER_COLORS = {
  reading   : '#2a6fdb',
  commentary: '#169c7b',
  qa        : '#d8890b',
  other     : '#9aa5b4'
};

// filter chip -> chapter types it shows
export const CHAPTER_FILTERS = {
  all    : CHAPTER_TYPES,
  reading: ['reading', 'commentary'],
  qa     : ['qa']
};

export const normalizeType = type => (CHAPTER_TYPES.includes(type) ? type : 'other');

export const chapterColor = type => CHAPTER_COLORS[normalizeType(type)];

export const getChapters = markup => {
  if (!Array.isArray(markup?.chapters)) return [];
  return markup.chapters
    .filter(c => Number.isFinite(c?.start))
    .map(c => ({ ...c, type: normalizeType(c.type) }));
};

// type label; what is read (the reader's announcement) or asked is the chapter's title, shown under it
export const chapterLabel = (t, chapter, idx) => {
  switch (chapter.type) {
    case 'reading':
    case 'commentary':
    case 'qa':
      return t(`lesson-flow.types.${chapter.type}`);
    default:
      return t(idx === 0 ? 'lesson-flow.types.intro' : 'lesson-flow.types.other');
  }
};

// index of the chapter playing at `time`; -1 before the first one
export const findChapterIdx = (chapters, time) => {
  let res = -1;
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].start <= time) res = i;
    else break;
  }

  return res;
};

export const formatChapterTime = sec => {
  const s   = Math.max(0, Math.floor(sec || 0));
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const ss  = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};
