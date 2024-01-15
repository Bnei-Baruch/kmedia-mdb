import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import {
  SEARCH_GRAMMAR_HIT_TYPES,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG,
  SEARCH_INTENT_HIT_TYPES,
  BLOGS,
} from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';

import { actions, selectors } from '../../redux/modules/search';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { selectors as publicationSelectors } from '../../redux/modules/publications';

import { filtersTransformer } from '../../filters';
import WipErr from '../shared/WipErr/WipErr';
import SectionFiltersWithMobile from '../shared/SectionFiltersWithMobile';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import {
  SearchResultCU,
  SearchResultCollection,
  SearchResultIntent,
  SearchResultLandingPage,
  SearchResultPost,
  SearchResultSeries,
  SearchResultSource,
  SearchResultTweets,
} from './SearchResultHooks';
import DidYouMean from './DidYouMean';
import Filters from './Filters';
import FilterLabels from '../FiltersAside/FilterLabels';
import ScoreDebug from './ScoreDebug';
import Helmets from '../shared/Helmets';

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

const SearchResults = ({ t }) => {
  const queryResult   = useSelector(state => selectors.getQueryResult(state.search));
  const searchResults = queryResult?.search_result;

  const cMap    = useSelector(state => cMapFromState(state, searchResults));
  const cuMap   = useSelector(state => cuMapFromState(state, searchResults));
  const postMap = useSelector(state => postMapFromState(state, searchResults));

  const wip = useSelector(state => selectors.getWip(state.search));
  const err = useSelector(state => selectors.getError(state.search));

  const pageNo   = useSelector(state => selectors.getPageNo(state.search));
  const pageSize = useSelector(state => settings.getPageSize(state.settings));

  const location = useLocation();
  const dispatch = useDispatch();

  /* Requested by Mizrahi
    const [showNote, setShowNote] = useState(true);
   */
  const filters          = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const areSourcesLoaded = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));
  const areTagsLoaded    = useSelector(state => tagsSelectors.areTagsLoaded(state.tags));

  const handlePageChange = page => {
    dispatch(actions.setPage(page));
  };

  const searchLanguageByIndex = (index, def) => index.split('_')[2] ?? def;

  const renderHit = (hit, rank, searchId, searchLanguage, deb) => {
    const {
      _source: { mdb_uid: mdbUid, result_type: resultType },
      _type: type,
      _index: index,
      _explanation: explanation,
      _score: score,
    } = hit;
    searchLanguage  = searchLanguageByIndex(index, searchLanguage);
    const clickData = { mdbUid, index, type: resultType, rank, searchId, search_language: searchLanguage, deb };

    let result = null;
    if (SEARCH_GRAMMAR_HIT_TYPES.includes(type)) {
      result =
        <SearchResultLandingPage landingPage={hit._source.landing_page} filterValues={hit._source.filter_values} clickData={clickData} />;
    } else if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      result =
        <SearchResultIntent id={hit._source.mdb_uid} name={hit._source.name} type={hit._type} index={index} clickData={clickData} />;
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

  /* Requested by Mizrahi
  const hideNote = () => setShowNote(false);

  const renderTopNote = () => {
    if (!showNote) {
      return null;
    }

    const language = t(`constants.languages.${contentLanguage}`);
    return (
      <Message info className="search-result-note">
        <Image floated="left">
          <SectionLogo name='info' />
        </Image>
        <Button floated="right" icon="close" size="tiny" circular onClick={hideNote} />
        <Container>
          <strong>
            {t('search.topNote.tip')}
            :
            {' '}
          </strong>
          {t('search.topNote.first', { language })}
        </Container>
        <Container>{t('search.topNote.second')}</Container>
      </Message>
    );
  };
   */

  const wipErr = WipErr({ wip: wip || !areSourcesLoaded || !areTagsLoaded, err, t });
  if (wipErr) {
    return wipErr;
  }

  // Query from URL (not changed until pressed Enter)
  const query = getQuery(location).q;
  const deb   = isDebMode(location);

  if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
    return <div>{t('search.results.empty-query')}</div>;
  }

  const { search_result: results, typo_suggest, language: searchLanguage } = queryResult;

  if (isEmpty(results)) {
    return null;
  }

  const { searchId, hits: { total, hits } } = results;
  // Elastic too slow and might fails on more than 1k results.
  const totalForPagination                  = Math.min(1000, total);

  //const wipErr = WipErr({ wip, err: null, t });
  const renderHelmet = section => {
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
        {total !== 0 && <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />}
        <FilterLabels namespace={'search'} />
        {/* Requested by Mizrahi renderTopNote() */}
        {wipErr || hits.map((h, rank) => renderHit(h, rank, searchId, searchLanguage, deb))}
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          {total > 0 && <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={totalForPagination}
            onChange={handlePageChange}
          />}
        </Container>
      </SectionFiltersWithMobile>
    </>);
};

SearchResults.propTypes = {
  t: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  queryResult: null,
  cMap: {},
  cuMap: {},
  wip: false,
  err: null,
  getSourcePath: undefined
};

export default withTranslation()(SearchResults);
