import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';
import { textPageGetFileSelector, textPageGetIsSearchSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const SearchOnPageBtn = () => {
  const isSearch  = useSelector(textPageGetIsSearchSelector);
  const { isPdf } = useSelector(textPageGetFileSelector);

  const dispatch = useDispatch();

  if (isPdf) return null;

  const handle = () => dispatch(actions.setIsSearch());

  return (
    <ToolbarBtnTooltip
      textKey="search"
      active={isSearch}
      onClick={handle}
      icon={<span className="material-symbols-outlined">search</span>}
    />
  );
};

export default SearchOnPageBtn;
