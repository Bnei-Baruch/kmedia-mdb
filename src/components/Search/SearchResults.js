import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Container, Divider, Header, Icon, Input, Label, Message } from 'semantic-ui-react';

import {
  CT_BLOG_POST,
  CT_ARTICLE,
  CT_SOURCE,
  CT_TAG,
  CT_VIDEO_PROGRAM,
  IsCollectionContentType,
  IsUnitContentType,
  SEARCH_GRAMMAR_HIT_TYPES,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG,
  SEARCH_INTENT_HIT_TYPES,
  SCT_TWEET,
  iconByContentTypeMap,
  BLOGS
} from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';
import { canonicalLink } from '../../helpers/links';

import { actions, SEARCH_TYPES } from '../../redux/modules/search';

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
  SearchResultOneItem,
  SearchResultPost,
  SearchResultSeries,
  SearchResultSource,
  SearchResultTweets
} from './SearchResultHooks';
import DidYouMean from './DidYouMean';
import Filters from './Filters';
import FilterLabels from '../FiltersAside/FilterLabels';
import ScoreDebug from './ScoreDebug';
import Helmets from '../shared/Helmets';
import UnitLogoWithDuration from '../shared/UnitLogoWithDuration';
import UnitLogo from '../shared/Logo/UnitLogo';
import { SectionLogo } from '../../helpers/images';
import {
  sourcesAreLoadedSelector,
  tagsAreLoadedSelector,
  publicationsGetBlogPostSelector,
  mdbGetDenormCollectionSelector,
  mdbGetDenormContentUnitSelector,
  filtersGetFiltersSelector,
  searchGetPageNoSelector,
  settingsGetPageSizeSelector,
  searchGetQueryResultSelector,
  searchGetReasoningResultSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector,
  searchGetErrorSelector,
  searchGetWipSelector
} from '../../redux/selectors';
import Link from '../Language/MultiLanguageLink';

const REASONING_STATUS_PHASES = ['pending', 'planning', 'thinking', 'verifying', 'done', 'error'];

const cuMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'units') {
        const cuID = val._source.mdb_uid;
        const cu   = mdbGetDenormContentUnitSelector(state, cuID);
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
        const p       = publicationsGetBlogPostSelector(state, blogObj.name, ids[1]);
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
        const c   = mdbGetDenormCollectionSelector(state, cID);
        if (c && c.content_units?.length) {
          acc[cID] = c;
        }
      }

      return acc;
    }, {})
    : {}
);

const SearchResults = ({ t }) => {
  const queryResult   = useSelector(searchGetQueryResultSelector) || false;
  const reasoningResult = useSelector(searchGetReasoningResultSelector);
  const reasoningStatus = useSelector(searchGetReasoningStatusSelector);
  const searchType    = useSelector(searchGetSearchTypeSelector);
  const searchResults = queryResult.search_result;
  const isAgenticSearch = searchType === SEARCH_TYPES.AGENTIC;

  const cMap    = useSelector(state => cMapFromState(state, searchResults));
  const cuMap   = useSelector(state => cuMapFromState(state, searchResults));
  const postMap = useSelector(state => postMapFromState(state, searchResults));

  const wip = useSelector(searchGetWipSelector);
  const err = useSelector(searchGetErrorSelector);

  const pageNo   = useSelector(searchGetPageNoSelector);
  const pageSize = useSelector(settingsGetPageSizeSelector);

  const location = useLocation();
  const dispatch = useDispatch();
  const [followupQuery, setFollowupQuery] = React.useState('');

  /* Requested by Mizrahi
    const [showNote, setShowNote] = useState(true);
   */
  const filters          = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const areSourcesLoaded = useSelector(sourcesAreLoadedSelector);
  const areTagsLoaded    = useSelector(tagsAreLoadedSelector);

  const handlePageChange = page => {
    dispatch(actions.setPage(page));
  };

  const handleSearchTypeChange = nextSearchType => {
    if (nextSearchType !== searchType) {
      dispatch(actions.setSearchType(nextSearchType));
    }
  };

  const renderHelmet = section => {
    const title    = t(`${section}.header.text`);
    const subText1 = t(`${section}.header.subtext`);
    return <Helmets.Basic title={title} description={subText1}/>;
  };

  const renderSearchFrame = children => (
    <>
      {renderHelmet('search')}
      {renderSearchTypeSwitch()}
      {children}
    </>
  );

  const renderSearchTypeSwitch = () => (
    <Container className="padded" textAlign="right">
      <Button.Group size="small">
        <Button
          active={searchType === SEARCH_TYPES.REGULAR}
          onClick={() => handleSearchTypeChange(SEARCH_TYPES.REGULAR)}
        >
          {t('search.types.regular')}
        </Button>
        <Button
          active={isAgenticSearch}
          onClick={() => handleSearchTypeChange(SEARCH_TYPES.AGENTIC)}
        >
          {t('search.types.agentic')}
        </Button>
      </Button.Group>
      <Label basic color="blue" className="margin-left-8 margin-right-8">
        {t('search.types.beta')}
      </Label>
      {isAgenticSearch && (
        <Container className="description padding-top-8" textAlign="right">
          {t('search.types.agenticBeta')}
        </Container>
      )}
    </Container>
  );

  const getAgenticStatusText = status => {
    if (!status) {
      return t('search.agentic.status.pending');
    }

    if (status.phase === 'running_tool') {
      return t(`search.agentic.status.tools.${status.tool_name}`, {
        defaultValue: t('search.agentic.status.tools.usingTool')
      });
    }

    if (REASONING_STATUS_PHASES.includes(status.phase)) {
      return t(`search.agentic.status.${status.phase}`);
    }

    if (status.state === 'completed') {
      return t('search.agentic.status.done');
    }

    if (status.state === 'failed') {
      return t('search.agentic.status.error');
    }

    return t('search.agentic.status.working');
  };

  const renderAgenticStatus = () => {
    if (!isAgenticSearch || !wip) {
      return null;
    }

    return (
      <Container className="padded">
        <Message info icon className="agentic-search__status-message">
          <Icon name="sync alternate" className="agentic-search__status-icon" />
          <Message.Content>
            <Message.Header>{t('search.agentic.statusTitle')}</Message.Header>
            <p>
              {[
                getAgenticStatusText(reasoningStatus),
                reasoningStatus?.iteration ? t('search.agentic.statusIteration', { iteration: reasoningStatus.iteration }) : null
              ].filter(Boolean).join(' | ')}
            </p>
          </Message.Content>
        </Message>
      </Container>
    );
  };

  const getAgenticResultMeta = result => {
    const resultType = result.result_type || '';

    switch (resultType) {
      case 'sources':
      case 'source':
        return { contentType: result.content_type || CT_SOURCE, linkContentType: CT_SOURCE };
      case 'tags':
      case 'tag':
      case 'topics':
      case 'topic':
        return { contentType: result.content_type || CT_TAG, linkContentType: CT_TAG };
      case 'posts':
      case 'post':
      case 'blog_posts':
      case 'blog_post':
        return { contentType: CT_BLOG_POST, linkContentType: 'POST' };
      case 'tweets':
      case 'tweet':
      case 'tweets_many':
      case 'twitter':
        return { contentType: result.content_type || SCT_TWEET, linkContentType: SCT_TWEET };
      default:
        if (result.content_type === 'POST') {
          return { contentType: CT_BLOG_POST, linkContentType: 'POST' };
        }

        if (result.content_type === CT_BLOG_POST) {
          return { contentType: CT_BLOG_POST, linkContentType: 'POST' };
        }

        if (result.content_type === CT_TAG) {
          return { contentType: CT_TAG, linkContentType: CT_TAG };
        }

        if (result.content_type === SCT_TWEET) {
          return { contentType: SCT_TWEET, linkContentType: SCT_TWEET };
        }

        return {
          contentType    : result.content_type || '',
          linkContentType: result.content_type || ''
        };
    }
  };

  const getAgenticLink = (result, linkContentType) => {
    const currentLink = { pathname: location.pathname, search: location.search, hash: location.hash };

    if (!result.mdb_uid) {
      return currentLink;
    }

    if (linkContentType === SCT_TWEET) {
      return { pathname: '/publications/twitter', search: '' };
    }

    if (
      linkContentType === 'POST' ||
      linkContentType === CT_SOURCE ||
      linkContentType === CT_TAG ||
      IsUnitContentType(linkContentType) ||
      IsCollectionContentType(linkContentType)
    ) {
      return canonicalLink({ id: result.mdb_uid, content_type: linkContentType });
    }

    return currentLink;
  };

  const renderAgenticIcon = (type, label, to) => {
    const icon = type === CT_TAG ? 'topics' : type === SCT_TWEET ? 'publications' : iconByContentTypeMap.get(type) || 'help';
    const content = (
      <div className="icon">
        <SectionLogo name={icon} width="70" height="70" />
        <span>{label}</span>
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  const renderAgenticLogo = (result, contentType, contentTypeLabel, to) => {
    if (contentType === CT_BLOG_POST) {
      return renderAgenticIcon(contentType, contentTypeLabel, to);
    }

    if (IsUnitContentType(contentType) && contentType !== CT_ARTICLE) {
      if (result.duration) {
        return <UnitLogoWithDuration unit={{ ...result, id: result.mdb_uid }} width={144} />;
      }

      return <div style={{ minWidth: 144 }}><UnitLogo unitId={result.mdb_uid} width={144} /></div>;
    }

    if (IsCollectionContentType(contentType) && contentType === CT_VIDEO_PROGRAM) {
      return <div style={{ minWidth: 144 }}><UnitLogo collectionId={result.mdb_uid} width={144} /></div>;
    }

    const iconType = contentType === CT_SOURCE ? 'sources' : contentType;
    return renderAgenticIcon(iconType, contentTypeLabel, to);
  };

  const renderAgenticContent = (result, highlights) => {
    if (!result.description && !result.reason && highlights.length === 0) {
      return null;
    }

    return (
      <div className="agentic-search__result-content">
        {result.description && <div className="agentic-search__result-line">{result.description}</div>}
        {result.reason && (
          <div className="agentic-search__result-line">
            <strong>{t('search.agentic.reason')}</strong>
            {`: ${result.reason}`}
          </div>
        )}
        {highlights.length > 0 && (
          <div className="agentic-search__result-line">
            <strong>{t('search.agentic.highlights')}</strong>
            {`: ${highlights.slice(0, 3).join(' | ')}`}
          </div>
        )}
      </div>
    );
  };

  const renderAgenticHit = (result, rank) => {
    const { contentType, linkContentType } = getAgenticResultMeta(result);
    const to          = getAgenticLink(result, linkContentType);
    const contentTypeLabel = contentType
      ? t(`constants.content-types.${contentType}`, { defaultValue: contentType })
      : '';
    const highlights       = Array.isArray(result.highlights) ? result.highlights : [];

    return <SearchResultOneItem
      key={`${result.mdb_uid}_${rank}`}
      id={`${result.mdb_uid}_${rank}`}
      title={result.title || result.mdb_uid}
      link={to}
      logo={renderAgenticLogo(result, contentType, contentTypeLabel, to)}
      content={renderAgenticContent(result, highlights)}
      collectionTitle={contentTypeLabel}
      date={result.date}
      click={() => null}
    />;
  };

  const handleReasoningFollowup = () => {
    const query = followupQuery.trim();
    if (!query || wip) {
      return;
    }

    dispatch(actions.reasoningFollowup({ query }));
    setFollowupQuery('');
  };

  const renderAgenticFollowup = () => {
    if (wip) {
      return null;
    }

    const remaining   = reasoningResult?.followups_remaining || 0;
    const canFollowup = !!reasoningResult?.session_id && remaining > 0;

    return (
      <Container className="padded">
        <Header as="h4" content={t('search.agentic.followupTitle')} />
        {canFollowup ? (
          <>
            <div className="description margin-bottom-8">
              {t('search.agentic.followupsRemaining', { count: remaining })}
            </div>
            <Input
              fluid
              value={followupQuery}
              placeholder={t('search.agentic.followupPlaceholder')}
              onChange={(e, data) => setFollowupQuery(data.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleReasoningFollowup();
                }
              }}
              action={
                <Button
                  primary
                  disabled={!followupQuery.trim()}
                  onClick={handleReasoningFollowup}
                >
                  {t('search.agentic.followupButton')}
                </Button>
              }
            />
          </>
        ) : (
          <Message info content={t('search.agentic.followupsExhausted')} />
        )}
      </Container>
    );
  };

  const renderAgenticResults = query => {
    const results     = Array.isArray(reasoningResult?.results) ? reasoningResult.results : [];
    const resultQuery = reasoningResult?.query || query;

    return renderSearchFrame(
      <>
        {renderAgenticStatus()}
        <Container className="padded">
          <Message
            warning
            icon="warning sign"
            header={t('search.agentic.warningTitle')}
            content={t('search.agentic.warning')}
          />
          {reasoningResult?.summary && (
            <Message
              info
              header={t('search.agentic.summary')}
              content={reasoningResult.summary}
            />
          )}
          {results.length === 0 && <div>{t('search.agentic.no-results', { query: resultQuery })}</div>}
          {results.length > 0 && <div className="agentic-search__results">{results.map(renderAgenticHit)}</div>}
          {renderAgenticFollowup()}
        </Container>
      </>
    );
  };

  const searchLanguageByIndex = (index, def) => index.split('_')[2] ?? def;

  const renderHit = (hit, rank, searchId, searchLanguage, deb) => {
    const
      {
        _source     : { mdb_uid: mdbUid, result_type: resultType },
        _type       : type,
        _index      : index,
        _explanation: explanation,
        _score      : score
      }             = hit;
    searchLanguage  = searchLanguageByIndex(index, searchLanguage);
    const clickData = { mdbUid, index, type: resultType, rank, searchId, search_language: searchLanguage, deb };

    let result = null;
    if (SEARCH_GRAMMAR_HIT_TYPES.includes(type)) {
      result =
        <SearchResultLandingPage landingPage={hit._source.landing_page} filterValues={hit._source.filter_values} clickData={clickData}/>;
    } else if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      result =
        <SearchResultIntent id={hit._source.mdb_uid} name={hit._source.name} type={hit._type} index={index} clickData={clickData}/>;
    } else if (type === 'tweets_many') {
      result = <SearchResultTweets source={hit._source} clickData={clickData}/>;
    } else if (type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG || type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE) {
      result = <SearchResultSeries id={hit._uid} type={type} mdbUid={hit._source.mdb_uid} clickData={clickData}/>;
    } else {
      const cu = cuMap[mdbUid];
      const c  = cMap[mdbUid];
      const p  = postMap[mdbUid];
      if (cu) {
        result = <SearchResultCU cu={cu} highlight={hit.highlight} clickData={clickData}/>;
      } else if (c) {
        result = <SearchResultCollection c={c} highlight={hit.highlight} clickData={clickData}/>;
      } else if (p) {
        result = <SearchResultPost id={hit._source.mdb_uid} post={p} highlight={hit.highlight} clickData={clickData}/>;
      } else if (resultType === 'sources') {
        result =
          <SearchResultSource id={hit._source.mdb_uid} title={hit._source.title} highlight={hit.highlight} clickData={clickData}/>;
      } else {
        console.error('Unexpected result type!');
      }
    }

    if (!deb) {
      return result;
    }

    return (
      <>
        <ScoreDebug score={score} explanation={explanation}/>
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

  // Query from URL (not changed until pressed Enter)
  const query = getQuery(location).q || '';
  const deb   = isDebMode(location);

  const wipErr = WipErr({ wip: !isAgenticSearch && (wip || !areSourcesLoaded || !areTagsLoaded), err, t });
  if (wipErr) {
    return renderSearchFrame(
      <>
        {renderAgenticStatus()}
        {wipErr}
      </>
    );
  }

  if ((isAgenticSearch && query === '') || (!isAgenticSearch && query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length)) {
    return renderSearchFrame(<div>{t('search.results.empty-query')}</div>);
  }

  if (isAgenticSearch) {
    if (!reasoningResult) {
      return renderSearchFrame(renderAgenticStatus());
    }

    return renderAgenticResults(query);
  }

  const { search_result: results, typo_suggest, language: searchLanguage } = queryResult;

  if (isEmpty(results)) {
    return renderSearchFrame(null);
  }

  const { searchId, hits: { total, hits } } = results;
  // Elastic too slow and might fails on more than 1k results.
  const totalForPagination                  = Math.min(1000, total);

  return renderSearchFrame(
    <SectionFiltersWithMobile
      namespace={'search'}
      filters={<Filters namespace={'search'}/>}
    >
      {typo_suggest && <DidYouMean typo_suggest={typo_suggest}/>}
      {total === 0 && <Trans i18nKey="search.results.no-results">
        Your search for
        <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong>
        found no results.
      </Trans>}
      {total !== 0 && <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t}/>}
      <FilterLabels namespace={'search'}/>
      {/* Requested by Mizrahi renderTopNote() */}
      {hits.map((h, rank) => renderHit(h, rank, searchId, searchLanguage, deb))}
      <Divider fitted/>
      <Container className="padded pagination-wrapper" textAlign="center">
        {total > 0 && <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={totalForPagination}
          onChange={handlePageChange}
        />}
      </Container>
    </SectionFiltersWithMobile>
  );
};

SearchResults.propTypes = {
  t: PropTypes.func.isRequired
};

SearchResults.defaultProps = {
  queryResult  : null,
  cMap         : {},
  cuMap        : {},
  wip          : false,
  err          : null,
  getSourcePath: undefined
};

export default withTranslation()(SearchResults);
