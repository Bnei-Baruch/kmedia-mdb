import React, { useMemo, useState } from 'react';
import { withTranslation, useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { FN_LANGUAGES, POPULAR_LANGUAGES, ALL_LANGUAGES } from '../../../../src/helpers/consts';
import { selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors } from '../../../redux/slices/filterSlice/filterStatsSlice';
import FilterHeader from '../FilterHeader';
import LanguageItem from './LanguageItem';

const Language = ({ namespace }) => {
  const { t } = useTranslation();

  const items           = useSelector(state => selectors.getTree(state.filterStats, namespace, FN_LANGUAGES));
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);

  const [showAll, setShowAll] = useState(selected.filter(x => POPULAR_LANGUAGES.includes(x)).length > 0);

  if (!(items?.length > 0)) return null;

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <FilterHeader
      filterName={FN_LANGUAGES}
      children={
        <>
          {
            items.filter(id => POPULAR_LANGUAGES.includes(id)).map(id =>
              <LanguageItem namespace={namespace} id={id} key={id} />
            )
          }
          {
            showAll && items
              .filter(id => ALL_LANGUAGES.includes(id))
              .filter(id => !POPULAR_LANGUAGES.includes(id))
              .map(id =>
                <LanguageItem namespace={namespace} id={id} key={id} />
              )
          }

          {
            items.length > POPULAR_LANGUAGES.length &&
            <Button
              basic
              icon={showAll ? 'minus' : 'plus'}
              color="blue"
              className="clear_button"
              content={t(`topics.show-${showAll ? 'less' : 'more'}`)}
              onClick={toggleShowAll}
            />
          }
        </>
      }
    />
  );
};

export default Language;
