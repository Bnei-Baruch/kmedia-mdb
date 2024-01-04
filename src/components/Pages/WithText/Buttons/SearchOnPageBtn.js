import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';

const SearchOnPageBtn = () => {
  const isSearch  = useSelector(state => textPage.getIsSearch(state.textPage));
  const { isPdf } = useSelector(state => textPage.getFile(state.textPage));

  const dispatch = useDispatch();

  if (isPdf) return null;

  const handle = () => dispatch(actions.setIsSearch());
  return (
    <Button
      active={isSearch}
      onClick={handle}
      icon={<span className="material-symbols-outlined">search</span>}
    />
  );
};

export default SearchOnPageBtn;
