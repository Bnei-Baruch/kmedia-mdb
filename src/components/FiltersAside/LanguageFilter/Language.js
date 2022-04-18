import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import FilterHeader from '../FilterHeader';
import LanguageItem from './LanguageItem';
import { Button } from 'semantic-ui-react';

const Language = ({ namespace, t }) => {
  const items    = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_LANGUAGES));
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES))?.values || [];

  const [showAll, setShowAll] = useState(selected.filter(x => POPULAR_LANGUAGES.includes(x)).length > 0);

  if (!(items?.length > 0)) return null;

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
          <Button
            basic
            icon={showAll ? 'minus' : 'plus'}
            color="blue"
            className="clear_button"
            content={t(`topics.show-${showAll ? 'less' : 'more'}`)}
            onClick={toggleShowAll}
          />
        </>
      }
    />
  );
};

export default withNamespaces()(Language);
