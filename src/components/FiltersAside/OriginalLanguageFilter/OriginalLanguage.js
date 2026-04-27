import React, { useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ALL_LANGUAGES, FN_ORIGINAL_LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';
import FilterHeader from '../FilterHeader';
import OriginalLanguageItem from './OriginalLanguageItem';
import { filtersAsideGetTreeSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const OriginalLanguage = ({ namespace, t }) => {
  const itemsAll        = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_ORIGINAL_LANGUAGES));
  const items           = itemsAll.filter(id => ALL_LANGUAGES.includes(id));
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_ORIGINAL_LANGUAGES));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const [showAll, setShowAll] = useState(selected.filter(x => POPULAR_LANGUAGES.includes(x)).length > 0);

  if (!(items?.length > 0)) return null;

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <FilterHeader
      filterName={FN_ORIGINAL_LANGUAGES}
      children={
        <>
          {
            items.filter(id => POPULAR_LANGUAGES.includes(id)).map(id =>
              <OriginalLanguageItem namespace={namespace} id={id} key={id}/>
            )
          }
          {
            showAll && items.filter(id => !POPULAR_LANGUAGES.includes(id)).map(id =>
              <OriginalLanguageItem namespace={namespace} id={id} key={id}/>
            )
          }
          {
            items.length > POPULAR_LANGUAGES.length &&
            <button
              className="clear_button text-blue-600 inline-flex items-center gap-1"
              onClick={toggleShowAll}
            >
              <span className="material-symbols-outlined">{showAll ? 'remove' : 'add'}</span>
              {t(`topics.show-${showAll ? 'less' : 'more'}`)}
            </button>
          }
        </>
      }
    />
  );
};

export default withTranslation()(OriginalLanguage);
