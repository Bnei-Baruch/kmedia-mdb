'use client';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Header } from 'semantic-ui-react';
import { PAGE_NS_ARTICLES, FN_TOPICS_MULTI, CT_ARTICLES, CT_ARTICLE } from '../../../../helpers/consts';
//import ContentTypeFilter from '../../../../../lib/filters/components/CollectionFilter/CollectionItem';
import TagSourceFilter from '../../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
//import TagSourceFilter from '../../../../../lib/filters/components/CollectionFilter/CollectionItem';
import Language from '../../../../../lib/filters/components/LanguageFilter/Language';
import DateFilter from '../../../../../lib/filters/components/DateFilter';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { fetchStats } from '../../../../../lib/redux/slices/filterSlice/thunks';
import { fetchPreparePage } from '../../../../../lib/redux/slices/preparePageSlice/thunks';

const Filters = ({ baseParams }) => {
  const namespace = PAGE_NS_ARTICLES;
  const { t }     = useTranslation();

  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(fetchPreparePage({ namespace, content_type: [CT_ARTICLES] }));
    }
  }, [isReady, wip, err]);

  useEffect(() => {
    if (!isReady && !wip && !err) {
      const _args = {
        namespace,
        isPrepare: true,
        params: {
          content_type: [CT_ARTICLE],
          with_collections: true,
          with_original_languages: true,
        }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, wip, err, namespace, dispatch]);

  useEffect(() => {
    if (isReady && needRefresh) {
      const _args = {
        namespace,
        isPrepare: false,
        params: {
          content_type: [CT_ARTICLE],
          with_collections: true,
          with_original_languages: true,
        }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, needRefresh, baseParams, namespace, dispatch]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      {/*<ContentTypeFilter namespace={namespace} />*/}
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;
