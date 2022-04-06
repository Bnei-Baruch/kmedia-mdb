import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import FilterHeader from '../FilterHeader';
import LanguageItem from './LanguageItem';
import { Link } from 'react-router-dom';

const Language = ({ namespace, t }) => {
  const items    = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_LANGUAGES));
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES))?.values || [];

  const [showAll, setShowAll] = useState(selected.filter(x => POPULAR_LANGUAGES.includes(x)).length > 0);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <FilterHeader
      filterName={FN_LANGUAGES}
      children={
        <>
          {
            items.filter(id => POPULAR_LANGUAGES.includes(id)).map(id => <LanguageItem namespace={namespace} id={id} />)
          }
          {
            showAll && items.filter(id => !POPULAR_LANGUAGES.includes(id)).map(id =>
              <LanguageItem namespace={namespace} id={id} />)
          }
          <Link onClick={toggleShowAll}>{t(`topics.show-${showAll ? 'less' : 'more'}`)}</Link>
        </>
      }
    />
  );
};

export default withNamespaces()(Language);
