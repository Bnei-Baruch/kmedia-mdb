import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTocInfoSelector } from '../../../../redux/selectors';

const TocSearch = () => {
  const { t } = useTranslation();

  const { match } = useSelector(textPageGetTocInfoSelector);

  const dispatch      = useDispatch();
  const handleChange  = e => search(e.target.value);
  const handleKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      search('');
    }
  };

  const search = m => dispatch(actions.setTocMatch(m));

  return (
    <div className="toc_filter">
      <div className="relative w-full">
        {!match && (
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 small pointer-events-none">search</span>
        )}
        <input
          className="toc_search w-full text-xs border border-gray-300 rounded px-2 py-1"
          placeholder={`${t('buttons.search')}...`}
          value={match}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>

  );
};

export default TocSearch;
