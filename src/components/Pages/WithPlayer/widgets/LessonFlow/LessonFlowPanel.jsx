import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LessonFlowChapters from './LessonFlowChapters';

const TAB_FLOW     = 'flow';
const TAB_PLAYLIST = 'playlist';

/**
 * Desktop aside for lessons with markup: sticky, viewport-height panel
 * with "Lesson flow" (default) and "Playlist" tabs.
 */
// height leaves room for the 80px site header (headroom) so the whole panel fits at page top
const LessonFlowPanel = ({ markup, playlist }) => {
  const { t }           = useTranslation();
  const [tab, setTab]   = useState(TAB_FLOW);

  const tabs = [
    { name: TAB_FLOW, label: t('lesson-flow.header') },
    { name: TAB_PLAYLIST, label: t('lesson-flow.playlist') }
  ];

  return (
    <div className="sticky top-[14px] flex h-[calc(100vh-110px)] min-h-[420px] flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
      <nav className="flex shrink-0 border-b border-gray-200" role="tablist">
        {
          tabs.map(({ name, label }) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm ${tab === name
                ? 'border-blue-600 font-semibold text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {label}
            </button>
          ))
        }
      </nav>
      {
        tab === TAB_FLOW
          ? <LessonFlowChapters markup={markup} className="flex-1" />
          : <div className="min-h-0 flex-1 overflow-y-auto">{playlist}</div>
      }
    </div>
  );
};

export default LessonFlowPanel;
