import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetFileSelector, textPageGetIsSearchSelector } from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const SearchOnPageBtn = () => {
  const { t } = useTranslation();

  const isSearch  = useSelector(textPageGetIsSearchSelector);
  const { isPdf } = useSelector(textPageGetFileSelector);

  const dispatch = useDispatch();

  if (isPdf) return null;

  const handle = () => dispatch(actions.setIsSearch());

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.search')}
      trigger={
        <Button
          active={isSearch}
          onClick={handle}
          icon={<span className="material-symbols-outlined">search</span>}
        />
      }
    />
  );
};

export default SearchOnPageBtn;
