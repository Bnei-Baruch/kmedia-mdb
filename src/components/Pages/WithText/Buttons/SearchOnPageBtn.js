import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetFileSelector, textPageGetIsSearchSelector } from '../../../../redux/selectors';

const SearchOnPageBtn = () => {
  const isSearch  = useSelector(textPageGetIsSearchSelector);
  const { isPdf } = useSelector(textPageGetFileSelector);

  const dispatch = useDispatch();

  if (isPdf) return null;

  const handle = () => dispatch(actions.setIsSearch());

  return (
    <Popup
      on="hover"
      content={t('page-with-text.buttons.search')}
      trigger={
        (
          <Button
            active={isSearch}
            onClick={handle}
            icon={<span className="material-symbols-outlined">search</span>}
          />
        )
      }
    />
  );
};

export default SearchOnPageBtn;
