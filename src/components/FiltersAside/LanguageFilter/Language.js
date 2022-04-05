import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';
import { Button, List } from 'semantic-ui-react';
import LanguageItem from './LanguageItem';
import { selectors as filters } from '../../../redux/modules/filters';
import { Link } from 'react-router-dom';

const Language = ({ namespace, t }) => {
  const items    = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_LANGUAGES));
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES))?.values || [];

  const [showAll, setShowAll] = useState(selected.filter(x => POPULAR_LANGUAGES.includes(x)).length > 0);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <List className="filter_aside">
      <List.Header className="title" content={t(`filters.aside-filter.${FN_LANGUAGES}`)} />
      {
        items.filter(id => POPULAR_LANGUAGES.includes(id)).map(id => <LanguageItem namespace={namespace} id={id} />)
      }
      {
        showAll && items.filter(id => !POPULAR_LANGUAGES.includes(id)).map(id =>
          <LanguageItem namespace={namespace} id={id} />)
      }
      <Link onClick={toggleShowAll}>{t(`topics.show-${showAll ? 'less' : 'more'}`)}</Link>
    </List>
  );
};

export default withNamespaces()(Language);
