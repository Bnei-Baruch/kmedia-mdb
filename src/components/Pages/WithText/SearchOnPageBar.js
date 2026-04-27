import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';

import { searchOnPage, deleteHighlightByRange, clearHighlightByStyle, addHighlightByRanges } from './helper';
import { actions } from '../../../redux/modules/textPage';
import { textPageGetIsSearchSelector } from '../../../redux/selectors';
import { isEmpty } from '../../../helpers/utils';

const SearchOnPageBar = () => {
  const [val, setVal]     = useState('');
  const [index, setIndex] = useState(-1);

  const refResults = useRef([]);
  const refInput   = useRef();
  const dispatch   = useDispatch();
  const { t }      = useTranslation();
  const isSearch   = useSelector(textPageGetIsSearchSelector);

  if (!isSearch) return null;

  const handleClose = () => {
    dispatch(actions.setIsSearch());
    clearing();
    setVal('');
    setIndex(-1);
  };

  const debouncedSearch = debounce(value => {
    clearing();
    value = value.trim();
    setVal(value);

    if (value.length > 0)
      search(value);
  }, 500);

  const handleChange = e => debouncedSearch(e.target.value);

  const search = (value = val) => {
    const str = value.trim();
    if (str.length === 0) return;

    const res = searchOnPage(str);

    if (res.length === 0)
      return;
    addHighlightByRanges(res, 'found_search');
    refResults.current = res;
    scrollByDir(0, 0);
  };

  const clearing = () => {
    refResults.current = [];
    clearHighlightByStyle('found_search');
    clearHighlightByStyle('selected_search');
  };

  const handleNext    = () => scrollByDir();
  const handlePrev    = () => scrollByDir(-1);
  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleNext();
    }
  };

  const scrollByDir   = (dir = 1, idx = index) => {
    let _index = idx + dir;
    if (idx === 0 && dir === -1) {
      _index = refResults.current.length - 1;
      dir    = 1;
    } else if (idx === refResults.current.length - 1 && dir === 1) {
      _index = 0;
      dir    = -1;
    }

    if (idx >= 0) {
      deleteHighlightByRange(refResults.current[idx], 'selected_search');
      addHighlightByRanges([refResults.current[idx]], 'found_search');
    }

    const range = refResults.current[_index];
    if (!range) {
      console.error('not found next range by index', _index);
      return;
    }

    addHighlightByRanges([range], 'selected_search');
    const el          = range.startContainer.parentElement;
    const rect        = el.getBoundingClientRect();
    const _additionPx = dir < 0 ? 150 : 60;
    window.scrollTo({
      top: rect.top + window.scrollY - _additionPx,
      left: 0,
      behavior: 'instant',
    });
    setIndex(_index);
    refInput.current.focus();
  };

  const noResults = isEmpty(refResults.current);
  return (
    <div className="text__search_on_page">
      <button
        className="clear_button text__search_on_page_close"
        onClick={handleClose}
      >
        {t('filters.date-filter.end')}
      </button>
      <div className="relative">
        <input
          ref={refInput}
          placeholder={`${t('buttons.search')}...`}
          onChange={handleChange}
          autoFocus={true}
          onKeyDown={handleKeyDown}
          size={1}
        />
        <div className="text__search_on_page_counter" dir="ltr">
          {
            (!noResults && index >= 0) && (`${index + 1} / ${refResults.current.length}`)
          }
        </div>
      </div>
      <button
        className="clear_button"
        disabled={noResults}
        onClick={handlePrev}
      >
        <span className="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
      <button
        className="clear_button"
        disabled={noResults}
        onClick={handleNext}
      >
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </button>
    </div>
  );
};

export default SearchOnPageBar;
