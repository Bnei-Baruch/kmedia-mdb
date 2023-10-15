import { Input } from 'semantic-ui-react';
import React, { useState } from 'react';
import { NotToFilter } from '../../../../lib/redux/slices/sourcesSlice';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { textFileSlice, selectors } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const FilterSource = ({ parentId }) => {
  const { t }    = useTranslation();
  const match    = useSelector(state => selectors.getMatch(state.textFile));
  const dispatch = useDispatch();

  if (NotToFilter.findIndex(a => a === parentId) !== -1) {
    return null;
  }

  const handleFilterChange = (e, data) => dispatch(textFileSlice.actions.setMatch(data.value));

  const handleFilterKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      dispatch(textFileSlice.actions.setMatch(''));
    }
  };

  return (
    <Input
      fluid
      size="mini"
      icon="search"
      placeholder={t('sources-library.filter')}
      value={match}
      onChange={handleFilterChange}
      onKeyDown={handleFilterKeyDown}
    />
  );
};
export default FilterSource;
