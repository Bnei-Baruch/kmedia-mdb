import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Trans, withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Button, Container, Divider, Grid, Modal } from 'semantic-ui-react';

import {
  SEARCH_GRAMMAR_HIT_TYPES,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG,
  SEARCH_INTENT_HIT_TYPES,
  BLOGS,
} from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { selectors as publicationSelectors } from '../../redux/modules/publications';
import { filtersTransformer } from '../../filters';
import WipErr from '../shared/WipErr/WipErr';
import SectionHeader from '../shared/SectionHeader';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import SearchResultCU from './SearchResultCU';
import SearchResultCollection from './SearchResultCollection';
import SearchResultIntent from './SearchResultIntent';
import SearchResultLandingPage from './SearchResultLandingPage';
import SearchResultTwitters from './SearchResultTwitters';
import SearchResultSource from './SearchResultSource';
import SearchResultPost from './SearchResultPost';
import DidYouMean from './DidYouMean';
import SearchResultSeries from './SearchResultSeries';
import Filters from './Filters';
import FilterLabels from '../FiltersAside/FilterLabels';

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
  const [openFilters, setOpenFilters] = useState(false);  // For mobile only.
  const closeFilters   = () => setOpenFilters(false);

  const queryResult = useSelector(state => selectors.getQueryResult(state.search));
  const searchResults     = queryResult.search_result;

  const cMap = useSelector(state => cMapFromState(state, searchResults));
  const cuMap = useSelector(state => cuMapFromState(state, searchResults));
  const postMap = useSelector(state => postMapFromState(state, searchResults));

  const wip = useSelector(state => selectors.getWip(state.search));
  const err = useSelector(state => selectors.getError(state.search));

  const pageNo = useSelector(state => selectors.getPageNo(state.search));
  const pageSize = useSelector(state => settings.getPageSize(state.settings));
  const language = useSelector(state => settings.getLanguage(state.settings));

  const location = useLocation();
  const dispatch = useDispatch();

  /* Requested by Mizrahi
    const [showNote, setShowNote] = useState(true);
   */
  const filters            = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const areSourcesLoaded   = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));
  const getTagById         = useSelector(state => tagsSelectors.getTagById(state.tags));
  const getSourcePath      = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const getSourceById      = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const contentLanguage    = useSelector(state => settings.getContentLanguage(state.settings));
  const chronicles         = useContext(ClientChroniclesContext);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = getLanguageDirection(language);

  const handlePageChange = page => {
    dispatch(actions.setPage(page));
  };

  const searchLanguageByIndex = (index, def) => index.split('_')[2] ?? def;

  const renderHit = (hit, rank, searchLanguage) => {
    const {
      _source: {
        mdb_uid: mdbUid,
        result_type: resultType,
        landing_page: landingPage,
        filter_values: filterValues
      }, _type: type, _index
    }   = hit;
    const key = mdbUid ? `${mdbUid}_${type}` : `${landingPage}_${type}_${(filterValues || []).map(({
      name,
      value
    }) => `${name}_${value}`).join('_')}`;

    searchLanguage = searchLanguageByIndex(_index, searchLanguage);
    const newProps = {
      queryResult, t, location, filters, getTagById, getSourceById, contentLanguage, getSourcePath, searchLanguage,
      hit, rank, key, chronicles,
    };

    if (SEARCH_GRAMMAR_HIT_TYPES.includes(type)) {
      return <SearchResultLandingPage {...newProps} />;
    }

    // To be deprecated soon.
    if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      return <SearchResultIntent {...newProps} />;
    }

    if (type === 'tweets_many') {
      return <SearchResultTwitters  {...newProps} />;
    }

    if (type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG || type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE) {
      return <SearchResultSeries {...newProps} />;
    }

    let result = null;
    const cu   = cuMap[mdbUid];
    const c    = cMap[mdbUid];
    const p    = postMap[mdbUid];

    if (cu) {
      result = <SearchResultCU {...newProps} cu={cu} />;
    } else if (c) {
      result = <SearchResultCollection c={c} {...newProps} />;
    } else if (p) {
      return <SearchResultPost {...newProps} post={p} />;
    } else if (resultType === 'sources') {
      result = <SearchResultSource {...newProps} />;
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return result;
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

  const wipErr = WipErr({ wip: !areSourcesLoaded, err, t });
  if (wipErr) {
    return wipErr;
  }

  // Query from URL (not changed until pressed Enter)
  const query = getQuery(location).q;

  if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
    return <div>{t('search.results.empty-query')}</div>;
  }

  const { search_result: results, typo_suggest, language: searchLanguage } = queryResult;

  if (isEmpty(results)) {
    return null;
  }

  const { /* took, */ hits: { total, hits } } = results;
  // Elastic too slow and might fails on more than 1k results.
  const totalForPagination                    = Math.min(1000, total);

  const renderFilters = () => (<Filters namespace={'search'} />);
  const renderSearchResults = () => (
    <>
      {/* Requested by Mizrahi renderTopNote() */}
      {typo_suggest && <DidYouMean typo_suggest={typo_suggest} />}

      <FilterLabels namespace={'search'} />

      {total === 0 ?
        <Trans i18nKey="search.results.no-results">
          Your search for
          <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong>
          found no results.
        </Trans>
        :
        <>
          <div className="searchResult_content">
            {wip ?
              WipErr({ wip, err: null, t })
              :
              <>
                <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
                {hits.map((h, rank) => renderHit(h, rank, searchLanguage))}
              </>
            }
          </div>
          <Divider fitted />
          <Container className="padded pagination-wrapper" textAlign="center">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={totalForPagination}
              language={language}
              onChange={handlePageChange}
            />
          </Container>
        </>
      }
    </>);

  return (
    <div>
      <>
        { isMobileDevice &&
          <>
            <Button className="search_mobile_filter" basic icon="filter" floated={'right'} onClick={() => setOpenFilters(true)} />
            <Modal
              closeIcon
              open={openFilters}
              onClose={closeFilters}
              dir={dir}
              className={dir}
            >
              <Modal.Content className="filters-aside-wrapper" scrolling>
                {renderFilters()}
              </Modal.Content>
              <Modal.Actions>
                <Button primary content={t('buttons.close')} onClick={closeFilters} />
              </Modal.Actions>
            </Modal>
          </>
        }
        <SectionHeader section="search" />
      </>
      <Container className="padded">
        { isMobileDevice ?
          <Grid divided>
            <Grid.Column>
              {renderSearchResults()}
            </Grid.Column>
          </Grid>
          :
          <Grid divided>
            <Grid.Column width="4" className="filters-aside-wrapper">
              {renderFilters()}
            </Grid.Column>
            <Grid.Column width="12">
              {renderSearchResults()}
            </Grid.Column>
          </Grid>
        }
      </Container>
    </div>
  );
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

export default withNamespaces()(SearchResults);
