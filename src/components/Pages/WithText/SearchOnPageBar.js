import React, { useState, useRef } from 'react';
import { Button, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import { searchOnPage, deleteHighlightByRange, clearHighlightByStyle, addHighlightByRanges } from './helper';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../redux/modules/textPage';

const SearchOnPageBar = () => {
  const [val, setVal]     = useState('');
  const [index, setIndex] = useState(0);

  const ref      = useRef();
  const dispatch = useDispatch();
  const isSearch = useSelector(state => textPage.getIsSearch(state.textPage));

  if (!isSearch) return null;

  const handleClose = () => {
    dispatch(actions.setIsSearch());
    clearHighlightByStyle('found_search');
    clearHighlightByStyle('selected_search');
  };

  const handleChange = debounce((e, { value }) => {
    setVal(value);

    search(value);
  }, 500);
  const handleSearch = () => search();
  const search       = (value = val) => {
    ref.current = [];
    setIndex(0);
    clearHighlightByStyle('found_search');

    const str = value.trim();
    if (str.length === 0) return;

    const res = searchOnPage(str);

    if (res.length === 0) return;
    addHighlightByRanges(res, 'found_search');
    ref.current = res;
    scrollByDir();
  };
  const handleNext   = () => scrollByDir();
  const handlePrev   = () => scrollByDir(-1);
  const scrollByDir  = (dir = 1) => {
    const _index = index + dir;
    if (index > 0) {
      deleteHighlightByRange(ref.current[index - 1], 'selected_search');
      addHighlightByRanges([ref.current[index - 1]], 'found_search');
    }
    const range = ref.current[_index - 1];
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
        ref.current && (<span>{index} / {ref.current.length}</span>)
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
        disabled={!ref.current || index === ref.current.length}
        icon={<span className="material-symbols-outlined">keyboard_arrow_down</span>}
        onClick={handleNext}
      />
      <Button
        basic
        disabled={!val}
        className="clear_button"
        icon={<span className="material-symbols-outlined">search</span>}
        onClick={handleSearch}
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
