import React from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import {
  SEARCH_GRAMMAR_HIT_TYPES,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG,
  SEARCH_INTENT_HIT_TYPES,
  BLOGS,
  DEFAULT_CONTENT_LANGUAGE,
  PAGE_NS_SEARCH,
} from '../../../src/helpers/consts';
import { isEmpty } from '../../../src/helpers/utils';

import { selectors } from '../../../lib/redux/slices/searchSlice/searchSlice';
import { selectors as mdbSelectors } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as publicationSelectors } from '../../../lib/redux/slices/publicationsSlice/thunks';

import { filtersTransformer } from '../../../lib/filters';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import Pagination from '../../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import {
  SearchResultCU,
  SearchResultCollection,
  SearchResultIntent,
  SearchResultLandingPage,
  SearchResultPost,
  SearchResultSeries,
  SearchResultSource,
  SearchResultTweets,
} from '../../../src/components/Search/SearchResultHooks';
import DidYouMean from '../../../src/components/Search/DidYouMean';
import Filters from '../../../src/components/Search/Filters';
import FilterLabels from '../../../lib/filters/components/FilterLabels';
import ScoreDebug from '../../../src/components/Search/ScoreDebug';
import Helmets from '../../../src/components/shared/Helmets';
import { wrapper } from '../../../lib/redux';
import { fetchSQData } from '../../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { baseParamsByNamespace } from '../[selector]/helper';
import { fetchSearch } from '../../../lib/redux/slices/searchSlice/thunks';

const cuMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'units') {
        const cuID = val._source.mdb_uid;
        const cu   = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
        if (cu) {
          acc[cuID] = cu;
        }
      }

      return acc;
    }, {})
    : {}
);

const postMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'posts') {
        const ids     = val._source.mdb_uid.split('-');
        const blogObj = BLOGS.find(b => b.id === parseInt(ids[0], 10));
        const p       = publicationSelectors.getBlogPost(state.publications, blogObj.name, ids[1]);
        if (p) {
          acc[val._source.mdb_uid] = p;
        }
      }

      return acc;
    }, {})
    : {}
);

const cMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'collections') {
        const cID = val._source.mdb_uid;
        const c   = mdbSelectors.getDenormCollection(state.mdb, cID);
        if (c && c.content_units?.length) {
          acc[cID] = c;
        }
      }

      return acc;
    }, {})
    : {}
);

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_SEARCH;

  await store.dispatch(fetchSQData());
  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state                                               = store.getState();
  const { page_no: pageNo = 1, q: query = '', deb = false } = context.query;

  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSearch({ query, pageNo, deb, pageSize }));

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, query, deb } };
});

const SearchPage = ({ pageSize, query, deb }) => {
  const { t }         = useTranslation();
  const queryResult   = useSelector(state => selectors.getQueryResult(state.search));
  const searchResults = queryResult.search_result;

  const cMap    = useSelector(state => cMapFromState(state, searchResults));
  const cuMap   = useSelector(state => cuMapFromState(state, searchResults));
  const postMap = useSelector(state => postMapFromState(state, searchResults));

  const wip = useSelector(state => selectors.getWip(state.search));
  const err = useSelector(state => selectors.getError(state.search));

  const searchLanguageByIndex = (index, def) => index.split('_')[2] ?? def;

  const renderHit = (hit, rank, searchId, searchLanguage, deb) => {
    const {
            _source: { mdb_uid: mdbUid, result_type: resultType },
            _type: type,
            _index: index,
            _explanation: explanation,
            _score: score,
          }         = hit;
    searchLanguage  = searchLanguageByIndex(index, searchLanguage);
    const clickData = { mdbUid, index, type: resultType, rank, searchId, search_language: searchLanguage, deb };

    let result = null;
    if (SEARCH_GRAMMAR_HIT_TYPES.includes(type)) {
      result =
        <SearchResultLandingPage landingPage={hit._source.landing_page} filterValues={hit._source.filter_values} clickData={clickData} />;
    } else if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      /*
      result =
        <SearchResultIntent id={hit._source.mdb_uid} name={hit._source.name} type={hit._type} index={index} clickData={clickData} />;
      */
    } else if (type === 'tweets_many') {
      result = <SearchResultTweets source={hit._source} clickData={clickData} />;
    } else if (type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG || type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE) {
      result = <SearchResultSeries id={hit._uid} type={type} mdbUid={hit._source.mdb_uid} clickData={clickData} />;
    } else {
      const cu = cuMap[mdbUid];
      const c  = cMap[mdbUid];
      const p  = postMap[mdbUid];
      if (cu) {
        result = <SearchResultCU cu={cu} highlight={hit.highlight} clickData={clickData} />;
      } else if (c) {
        result = <SearchResultCollection c={c} highlight={hit.highlight} clickData={clickData} />;
      } else if (p) {
        result = <SearchResultPost id={hit._source.mdb_uid} post={p} highlight={hit.highlight} clickData={clickData} />;
      } else if (resultType === 'sources') {
        result =
          <SearchResultSource id={hit._source.mdb_uid} title={hit._source.title} highlight={hit.highlight} clickData={clickData} />;
      } else {
        console.error('Unexpected result type!');
      }
    }

    if (!deb) {
      return result;
    }

    return (
      <>
        <ScoreDebug score={score} explanation={explanation} />
        {result}
      </>
    );
  };

  // Query from URL (not changed until pressed Enter)
  /*
    if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
      return <div>{t('search.results.empty-query')}</div>;
    }*/

  const { search_result: results, typo_suggest, language: searchLanguage } = queryResult;

  if (isEmpty(results)) {
    return null;
  }

  const { searchId, hits: { total, hits } } = results;
  // Elastic too slow and might fails on more than 1k results.
  const totalForPagination                  = Math.min(1000, total);

  //const wipErr = WipErr({ wip, err: null, t });
  const renderHelmet = (section) => {
    const title    = t(`${section}.header.text`);
    const subText1 = t(`${section}.header.subtext`);
    return <Helmets.Basic title={title} description={subText1} />;
  };

  return (
    <>
      {renderHelmet('search')}
      <SectionFiltersWithMobile
        namespace={'search'}
        filters={<Filters namespace={'search'} />}
      >
        {typo_suggest && <DidYouMean typo_suggest={typo_suggest} />}
        {total === 0 && <Trans i18nKey="search.results.no-results">
          Your search for
          <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong>
          found no results.
        </Trans>}
        <ResultsPageHeader total={total} pageSize={pageSize} />
        <FilterLabels namespace={'search'} />
        {/* Requested by Mizrahi renderTopNote() */}
        {
          hits.map((h, rank) => renderHit(h, rank, searchId, searchLanguage, deb))
        }
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          <Pagination pageSize={pageSize} total={totalForPagination} />
        </Container>
      </SectionFiltersWithMobile>
    </>);
};

export default SearchPage;
