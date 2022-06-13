import React from 'react';
import { useSelector } from 'react-redux';
import { ALL_LANGUAGES, FN_ORIGINAL_LANGUAGES } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../FilterHeader';
import OriginalLanguageItem from './OriginalLanguageItem';

const OriginalLanguage = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_ORIGINAL_LANGUAGES));

  if (isEmpty(items))
    return null;

  return (
    <FilterHeader
      filterName={FN_ORIGINAL_LANGUAGES}
      children={
        <>
          {
            items.filter(id => ALL_LANGUAGES.includes(id)).map(id =>
              <OriginalLanguageItem namespace={namespace} id={id} key={id} />
            )
          }
        </>
      }
    />
  );
};

export default OriginalLanguage;
