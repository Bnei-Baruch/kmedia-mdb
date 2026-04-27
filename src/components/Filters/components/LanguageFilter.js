import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from '../../../helpers/utils';
import { ALL_LANGUAGES, AUDIO_BLOG_LANGUAGES, LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';

const LanguageFilter = ({ value = null, namespace, onCancel = noop, onApply = noop }) => {
  const { t } = useTranslation();

  const displayedLanguages = namespace === 'publications-audio-blog'
    ? AUDIO_BLOG_LANGUAGES
    : ALL_LANGUAGES.filter(l => !POPULAR_LANGUAGES.includes(l));

  return (
    <div className="border rounded">
      <div className="filter-popup__header bg-gray-100 p-3">
        <div className="title">
          <button
            className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50"
            onClick={onCancel}
          >
            <span className="material-symbols-outlined small">close</span>
          </button>
          <h4 className="small font-semibold text-center flex-1">{t('filters.language-filter.label')}</h4>
        </div>
      </div>
      <div className="filter-popup__body language-filter p-3">
        <nav className="flex flex-col w-full small">
          {
            displayedLanguages.map(x => (
              <div
                key={x}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${value === x ? 'bg-blue-50 font-semibold' : ''}`}
                onClick={() => onApply(x)}
              >
                {LANGUAGES[x].name}
              </div>
            ))
          }
        </nav>
      </div>
    </div>
  );
};

LanguageFilter.propTypes = {
  namespace: PropTypes.string,
  value    : PropTypes.string,
  onCancel : PropTypes.func,
  onApply  : PropTypes.func,
};

export default LanguageFilter;
