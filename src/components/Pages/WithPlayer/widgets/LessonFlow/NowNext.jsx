import { useTranslation } from 'react-i18next';

import useCurrentChapter from './useCurrentChapter';
import { chapterColor, chapterLabel, formatChapterTime } from './helper';
import { seekToChapter } from './actions';
import useChapterTexts from './useChapterTexts';
import { paragraphAt, useTranscriptLanguageForLinks, useTranscriptLink } from './transcriptLink';

// "Now: <chapter>" + "Next: <chapter> m:ss ›" line under the player
const NowNext = ({ markup }) => {
  const { t }    = useTranslation();
  const { chapters } = markup;
  const { idx, time } = useCurrentChapter(chapters);
  useChapterTexts(markup); // loads the transcript the links point into
  const link     = useTranscriptLink(markup);
  useTranscriptLanguageForLinks(markup);
  const playing  = paragraphAt(markup.paragraphs, time);

  const current = idx >= 0 ? chapters[idx] : null;
  const next    = chapters[idx + 1];

  return (
    <div className="my-2 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
      {
        current && (
          <>
            <span className="text-gray-500">{t('lesson-flow.now')}:</span>
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: chapterColor(current.type) }}
              aria-hidden="true"
            />
            <b>{chapterLabel(t, current, idx)}</b>
          </>
        )
      }
      {
        link.enabled && playing && (
          <button
            type="button"
            onClick={() => link.toText(playing.i)}
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title={t('lesson-flow.to-text-now')}
          >
            ¶ {t('lesson-flow.to-text')}
          </button>
        )
      }
      {
        next && (
          <button
            type="button"
            onClick={() => seekToChapter(next)}
            className="ms-auto rounded-md bg-blue-50 px-3 py-1 text-blue-700 hover:bg-blue-100"
          >
            {t('lesson-flow.next')}: {chapterLabel(t, next, idx + 1)}
            {' '}
            <span className="font-mono text-xs" dir="ltr">{formatChapterTime(next.start)}</span>
            {' '}
            <span className="inline-block rtl:rotate-180" aria-hidden="true">›</span>
          </button>
        )
      }
    </div>
  );
};

export default NowNext;
