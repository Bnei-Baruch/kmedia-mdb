import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { SEARCH_GRAMMAR_HIT_TYPES, SEARCH_INTENT_HIT_TYPES } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import WipErr from '../shared/WipErr/WipErr';
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

const SearchResults = (props) => {
  /* Requested by Mizrahi
    const [showNote, setShowNote] = useState(true);
    const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
   */
  const filters          = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const areSourcesLoaded = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));
  const getTagById       = useSelector(state => tagsSelectors.getTagById(state.tags));
  const getSourcePath    = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const getSourceById    = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const contentLanguage  = useSelector(state => settings.getContentLanguage(state.settings));

  const
    {
      queryResult,
      cMap,
      cuMap,
      postMap,
      wip,
      err,
      hitType,
      // Requested by Mizrahi contentLanguage,
      pageNo,
      pageSize,
      language,
      t,
      handlePageChange,
      location,
    } = props;

  const filterByHitType = hit => hitType ? hit.type === hitType : true;

  const renderHit = (hit, rank) => {
    const { _source: { mdb_uid: mdbUid, result_type: resultType, landing_page: landingPage }, _type: type } = hit;

    const newProps = {
      ...props, filters, getTagById, getSourceById, contentLanguage, getSourcePath,
      hit, rank, key: `${mdbUid || landingPage}_${type}`
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

  const wipErr = WipErr({ wip: wip || !areSourcesLoaded, err, t });
  if (wipErr) {
    return wipErr;
  }

  // Query from URL (not changed until pressed Enter)
  const query = getQuery(location).q;

  if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
    return <div>{t('search.results.empty-query')}</div>;
  }

  const { search_result: results, typo_suggest } = queryResult;

  if (isEmpty(results)) {
    return null;
  }

  const { /* took, */ hits: { total, hits } } = results;
  // Elastic too slow and might fails on more than 1k results.
  const totalForPagination                    = Math.min(1000, total);

  if (total === 0) {
    return (
      <Trans i18nKey="search.results.no-results">
        Your search for
        <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong>
        found no results.
      </Trans>
    );
  }

  return (
    <Grid>
      <Grid.Column key="1" computer={12} tablet={16} mobile={16}>
        {/* Requested by Mizrahi renderTopNote() */}
        {typo_suggest && <DidYouMean typo_suggest={typo_suggest} />}

        <div className="searchResult_content">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
          {hits.filter(filterByHitType).map(renderHit)}
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
      </Grid.Column>
      <Grid.Column key="2" />
    </Grid>
  );
};

SearchResults.propTypes = {
  getSourcePath: PropTypes.func,
  queryResult: PropTypes.shape({
    intents: PropTypes.arrayOf(PropTypes.shape({
      language: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.shape({}),
    })),
    search_result: PropTypes.shape({})
  }),
  cMap: PropTypes.objectOf(shapes.Collection),
  cuMap: PropTypes.objectOf(shapes.ContentUnit),
  twitterMap: PropTypes.objectOf(shapes.Tweet),
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  location: shapes.HistoryLocation.isRequired,
  click: PropTypes.func.isRequired,
  postMap: PropTypes.objectOf(PropTypes.shape({
    blog: PropTypes.string,
    content: PropTypes.string,
    created_at: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    wp_id: PropTypes.number,
  })).isRequired,
  hitType: PropTypes.shape({}),
};

SearchResults.defaultProps = {
  queryResult: null,
  cMap: {},
  cuMap: {},
  twitterMap: {},
  wip: false,
  err: null,
  getSourcePath: undefined,
};

export default withNamespaces()(SearchResults);
