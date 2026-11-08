import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import useLessonMarkup from './useLessonMarkup';
import { chapterColor, chapterLabel, findChapterIdx } from './helper';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { playerGetFileSelector } from '../../../../../redux/selectors';

/**
 * Colored chapter segments over the player progress bar (rendered inside .slider__wrapper).
 * Renders nothing when the current unit has no markup.
 */
const ChaptersBar = () => {
  const markup = useLessonMarkup();
  const file   = useSelector(playerGetFileSelector);

  if (!markup) return null;

  const duration = file?.duration || markup.media?.duration_s;
  if (!duration) return null;

  return <Segments chapters={markup.chapters} duration={duration} />;
};

const Segments = ({ chapters, duration }) => {
  const { t }        = useTranslation();
  const { isMobile } = useContext(DeviceInfoContext);
  const ref          = useRef(null);
  const [hover, setHover] = useState(null);

  const pct = sec => `${Math.min(100, Math.max(0, (100 * sec) / duration))}%`;

  const handleMove = e => {
    if (isMobile || !ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    const x               = Math.min(Math.max(0, e.clientX - left), width);
    const idx             = findChapterIdx(chapters, (x / width) * duration);
    setHover(idx >= 0 ? { idx, x } : null);
  };

  const hovered = hover && chapters[hover.idx];

  return (
    <div
      ref={ref}
      className="slider__chapters"
      // hover zone covers the strip and the bar itself; placed before ProgressBar so the thumb stays on top.
      // note: `.controls__slider *` makes every descendant position:absolute
      style={{ left: 0, right: 0, top: '-8px', bottom: '-8px' }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      {
        chapters.map((c, i) => {
          const end = c.end ?? chapters[i + 1]?.start ?? duration;
          return (
            <div
              key={i}
              style={{
                left           : pct(c.start),
                width          : `calc(${pct(end - c.start)} - 2px)`,
                top            : '2px',
                height         : '3px',
                borderRadius   : '1px',
                backgroundColor: chapterColor(c.type),
                pointerEvents  : 'none'
              }}
            />
          );
        })
      }
      {
        hovered && (
          <div
            className="pointer-events-none whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white"
            style={{ left: hover.x, bottom: '100%', transform: 'translateX(-50%)', marginBottom: '4px' }}
          >
            {chapterLabel(t, hovered, hover.idx)}
            {
              hovered.title && (
                <span className="block max-w-[260px] truncate opacity-75" dir="auto" style={{ position: 'static' }}>{hovered.title}</span>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default ChaptersBar;
