import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { CT_VIRTUAL_LESSONS, FN_SOURCES_MULTI, FN_TOPICS_MULTI, PAGE_NS_LESSONS } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filtersAside';
import { actions as prepareActions } from '../../../redux/modules/preparePage';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import MediaTypeFilter from '../../FiltersAside/MediaTypeFilter/MediaType';
import OriginalLanguageFilter from '../../FiltersAside/OriginalLanguageFilter/OriginalLanguage';
import PersonFilter from '../../FiltersAside/PersonFilter/Person';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import ContentTypeFilter from './Filters/ContentTypeFilter';
import {
  settingsGetContentLanguagesSelector,
  filtersAsideGetIsReadySelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetUILangSelector,
  filtersAsideGetWipErrSelector
} from '../../../redux/selectors';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }            = useTranslation();
  const uiLang           = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const isReady          = useSelector(state => filtersAsideGetIsReadySelector(state, namespace));
  const { wip, err }     = useSelector(state => filtersAsideGetWipErrSelector(state, namespace));
  const selected         = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace));
  const prevSelRef       = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(prepareActions.fetchCollections(PAGE_NS_LESSONS, { content_type: [CT_VIRTUAL_LESSONS] }));
    }
  }, [uiLang, contentLanguages, dispatch, isReady, wip, err]);

  useEffect(() => {
    console.log('fetch stats hydrated', isReady, wip, err, !isReady && !wip && !err ? 'FETCHING' : '');
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, {
        ...baseParams,
        with_persons           : true,
        with_media             : true,
        with_original_languages: true,
        with_day_part          : true
      }, { isPrepare: true, countC: true }));
    }
  }, [isReady, baseParams, wip, err, namespace, dispatch]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, {
        ...baseParams,
        with_persons           : true,
        with_media             : true,
        with_original_languages: true,
        with_day_part          : true
      }, {
        isPrepare: false,
        countC   : true
      }));
      prevSelRef.current = selLen;
    }
  }, [isHydrated, isReady, selLen, baseParams, namespace, dispatch]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated}/>
      <Header as="h3" content={t('filters.aside-filter.filters-title')}/>
      <ContentTypeFilter namespace={namespace}/>
      <PersonFilter namespace={namespace}/>
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI}/>
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI}/>
      <Language namespace={namespace}/>
      <OriginalLanguageFilter namespace={namespace}/>
      <DateFilter namespace={namespace}/>
      <MediaTypeFilter namespace={namespace}/>
    </Container>
  );
};

export default Filters;
