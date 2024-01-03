import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import { searchOnPage, deleteHighlightByRange, clearHighlightByStyle, addHighlightByRanges } from './helper';
import { selectors as textPage, actions } from '../../../redux/modules/textPage';

const SearchOnPageBar = () => {
  const [val, setVal]     = useState('');
  const [index, setIndex] = useState(-1);

  const ref      = useRef([]);
  const dispatch = useDispatch();
  const isSearch = useSelector(state => textPage.getIsSearch(state.textPage));

  if (!isSearch) return null;

  const handleClose  = () => {
    dispatch(actions.setIsSearch());
    clearing();
    setVal('');
    setIndex(-1);
  };
  const handleChange = debounce((e, { value }) => {
    clearing();
    value = value.trim();
    setVal(value);

    if (value.length > 0)
      search(value);
  }, 500);
  const search       = (value = val) => {
    const str = value.trim();
    if (str.length === 0) return;

    const res = searchOnPage(str);

    if (res.length === 0)
      return;
    addHighlightByRanges(res, 'found_search');
    ref.current = res;
    scrollByDir(0, 0);
  };
  const clearing     = () => {
    ref.current = [];
    clearHighlightByStyle('found_search');
    clearHighlightByStyle('selected_search');
  };
  const handleNext   = () => scrollByDir();
  const handlePrev   = () => scrollByDir(-1);
  const scrollByDir  = (dir = 1, idx = index) => {
    const _index = idx + dir;
    if (idx >= 0) {
      deleteHighlightByRange(ref.current[idx], 'selected_search');
      addHighlightByRanges([ref.current[idx]], 'found_search');
    }

    const range = ref.current[_index];
    if (!range) {
      console.error('not found next range by index', _index);
      return;
    }

    addHighlightByRanges([range], 'selected_search');
    const el   = range.startContainer.parentElement;
    const rect = el.getBoundingClientRect();
    window.scrollTo(0, rect.top + window.scrollY - 60);
    setIndex(_index);
  };

  return (
    <div className="text__search_on_page">
      <Input
        size="small"
        placeholder="Search..."
        onChange={handleChange}
      />
      {
        (ref.current && index >= 0) && (<span>{index + 1} / {ref.current.length}</span>)
      }
      <Button
        basic
        className="clear_button"
        disabled={index === 0 || ref.current.length < 2}
        icon={<span className="material-symbols-outlined">keyboard_arrow_up</span>}
        onClick={handlePrev}
      />
      <Button
        basic
        className="clear_button"
        disabled={!ref.current || (index === ref.current.length - 1)}
        icon={<span className="material-symbols-outlined">keyboard_arrow_down</span>}
        onClick={handleNext}
      />
      <Button
        basic
        className="clear_button"
        icon={<span className="material-symbols-outlined">close</span>}
        onClick={handleClose}
      />
    </div>
  );
};

export default SearchOnPageBar;
