import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Card, Checkbox, Container, Divider, Feed, Header, Icon, Label, Message } from 'semantic-ui-react';

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
import { getQuery, isDebMode, stringify } from '../../helpers/url';
import { canonicalLink } from '../../helpers/links';

import { actions, isAgenticSearchType, SEARCH_TYPES } from '../../redux/modules/search';
import { actions as publicationActions } from '../../redux/modules/publications';

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
import TwitterFeed from '../Sections/Publications/tabs/Twitter/Feed';
import { SectionLogo } from '../../helpers/images';
import {
  sourcesAreLoadedSelector,
  tagsAreLoadedSelector,
  publicationsGetBlogPostSelector,
  publicationsGetTwitterSelector,
  mdbGetDenormCollectionSelector,
  mdbGetDenormContentUnitSelector,
  filtersGetFiltersSelector,
  searchGetPageNoSelector,
  settingsGetPageSizeSelector,
  settingsGetUILangSelector,
  searchGetQueryResultSelector,
  searchGetReasoningPreviousSearchesSelector,
  searchGetReasoningRequestKindSelector,
  searchGetReasoningResultSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector,
  searchGetErrorSelector,
  searchGetWipSelector,
  authGetUserSelector
} from '../../redux/selectors';
import { buildHighlightLinkTarget } from './highlightLink';
import Link from '../Language/MultiLanguageLink';
import { login } from '../../pkg/ksAdapter/adapter';

const REASONING_STATUS_PHASES = ['pending', 'planning', 'thinking', 'verifying', 'finalizing', 'done', 'error'];
const AGENTIC_TWEET_RESULT_TYPES = new Set(['twitter', 'tweet', 'tweets', 'tweets_many']);

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

const isAgenticTweetResult = result => !!result?.mdb_uid && (
  AGENTIC_TWEET_RESULT_TYPES.has(result?.result_type) || getAgenticResultMeta(result).contentType === SCT_TWEET
);

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
  const reasoningPreviousSearches = useSelector(searchGetReasoningPreviousSearchesSelector);
  const reasoningRequestKind = useSelector(searchGetReasoningRequestKindSelector);
  const reasoningResult = useSelector(searchGetReasoningResultSelector);
  const reasoningStatus = useSelector(searchGetReasoningStatusSelector);
  const searchType    = useSelector(searchGetSearchTypeSelector);
  const user          = useSelector(authGetUserSelector);
  const searchResults = queryResult.search_result;
  const isAgenticSearch = isAgenticSearchType(searchType);
  const isRapidAgenticSearch = searchType === SEARCH_TYPES.AGENTIC_RAPID;
  const canUseAgenticSearch = !!user;

  const cMap    = useSelector(state => cMapFromState(state, searchResults));
  const cuMap   = useSelector(state => cuMapFromState(state, searchResults));
  const postMap = useSelector(state => postMapFromState(state, searchResults));

  const wip = useSelector(searchGetWipSelector);
  const err = useSelector(searchGetErrorSelector);
  const storedAgenticResults = React.useMemo(() => (
    Array.isArray(reasoningResult?.results) ? reasoningResult.results : []
  ), [reasoningResult]);
  const rapidAgenticResults  = Array.isArray(reasoningStatus?.rapid_results) ? reasoningStatus.rapid_results : [];
  const isShowingRapidAgenticResults = (
    isRapidAgenticSearch
    && reasoningStatus?.rapid_results_available
    && rapidAgenticResults.length > 0
  );

  // Rapid search can stream provisional results from /status before the final /result snapshot is ready.
  const currentAgenticResults = isShowingRapidAgenticResults ? rapidAgenticResults : storedAgenticResults;
  const previousAgenticSearches = React.useMemo(() => (
    Array.isArray(reasoningPreviousSearches) ? reasoningPreviousSearches : []
  ), [reasoningPreviousSearches]);

  const pageNo   = useSelector(searchGetPageNoSelector);
  const pageSize = useSelector(settingsGetPageSizeSelector);
  const uiLang   = useSelector(settingsGetUILangSelector);

  const location = useLocation();
  const dispatch = useDispatch();
  const followupStatusRef = React.useRef(null);
  const currentTurnRef = React.useRef(null);
  const shouldScrollToCompletedFollowupRef = React.useRef(false);
  const followupWasRunningRef = React.useRef(false);
  const [followupQuery, setFollowupQuery] = React.useState('');
  const [scrollToFollowupStatus, setScrollToFollowupStatus] = React.useState(false);
  const [blockedAgenticSearchType, setBlockedAgenticSearchType] = React.useState(null);
  const [showAgenticNudge, setShowAgenticNudge] = React.useState(true);
  const [isSearchDeeperHintVisible, setSearchDeeperHintVisible] = React.useState(true);
  const visibleSearchType = blockedAgenticSearchType || searchType;
  const shouldShowAgenticLoginPrompt = !canUseAgenticSearch && isAgenticSearchType(visibleSearchType);

  /* Requested by Mizrahi
    const [showNote, setShowNote] = useState(true);
   */
  const filters          = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const areSourcesLoaded = useSelector(sourcesAreLoadedSelector);
  const areTagsLoaded    = useSelector(tagsAreLoadedSelector);
  const agenticTweetIds  = React.useMemo(() => {
    if (!isAgenticSearch) {
      return [];
    }

    const previousResults = previousAgenticSearches.reduce((results, search) => (
      results.concat(search?.results || [])
    ), []);

    return [...currentAgenticResults, ...storedAgenticResults, ...previousResults]
      .filter(isAgenticTweetResult)
      .map(result => result.mdb_uid)
      .filter((mdbUid, index, ids) => ids.indexOf(mdbUid) === index);
  }, [currentAgenticResults, isAgenticSearch, previousAgenticSearches, storedAgenticResults]);
  const agenticTweetsById = useSelector(state => agenticTweetIds.reduce((acc, mdbUid) => {
    const tweet = publicationsGetTwitterSelector(state, mdbUid);
    if (tweet) {
      acc[mdbUid] = tweet;
    }

    return acc;
  }, {}));
  const missingAgenticTweetIds = agenticTweetIds.filter(mdbUid => !agenticTweetsById[mdbUid]);
  const missingAgenticTweetIdsKey = missingAgenticTweetIds.join(',');

  React.useEffect(() => {
    if (canUseAgenticSearch && blockedAgenticSearchType) {
      setBlockedAgenticSearchType(null);
    }
  }, [blockedAgenticSearchType, canUseAgenticSearch]);

  React.useEffect(() => {
    if (!scrollToFollowupStatus || !wip || !followupStatusRef.current) {
      return;
    }

    followupStatusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScrollToFollowupStatus(false);
  }, [scrollToFollowupStatus, wip]);

  React.useEffect(() => {
    if (!shouldScrollToCompletedFollowupRef.current) {
      return;
    }

    if (wip) {
      followupWasRunningRef.current = true;
      return;
    }

    if (!followupWasRunningRef.current) {
      return;
    }

    if (reasoningStatus?.state === 'completed' && currentTurnRef.current) {
      currentTurnRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    shouldScrollToCompletedFollowupRef.current = false;
    followupWasRunningRef.current = false;
  }, [reasoningResult, reasoningStatus?.state, wip]);

  React.useEffect(() => {
    if (!isAgenticSearch || !missingAgenticTweetIdsKey) {
      return;
    }

    dispatch(publicationActions.fetchTweets('tweets_many', 1, { id: missingAgenticTweetIdsKey.split(',') }));
  }, [dispatch, isAgenticSearch, missingAgenticTweetIdsKey]);

  const handlePageChange = page => {
    dispatch(actions.setPage(page));
  };

  const handleSearchTypeChange = (nextSearchType, startSearch = false) => {
    if (isAgenticSearchType(nextSearchType) && !canUseAgenticSearch) {
      setBlockedAgenticSearchType(nextSearchType);
      return;
    }

    setBlockedAgenticSearchType(null);

    if (nextSearchType !== searchType) {
      dispatch(actions.setSearchType(nextSearchType));
    }

    if (startSearch) {
      dispatch(actions.search());
    }
  };

  const renderAgenticNudge = () => {
    if (!showAgenticNudge) {
      return null;
    }

    return (
      <div className="agentic-search__nudge">
        <span className="agentic-search__nudge-sparkle" aria-hidden="true">&#10022;</span>
        <div className="agentic-search__nudge-copy">
          <div className="agentic-search__nudge-title">{t('search.agentic.nudge.title')}</div>
          <div className="agentic-search__nudge-message">{t('search.agentic.nudge.message', { query })}</div>
        </div>
        <Button
          className="agentic-search__nudge-button"
          onClick={() => handleSearchTypeChange(SEARCH_TYPES.AGENTIC_RAPID, true)}
        >
          <span className="agentic-search__nudge-button-sparkle" aria-hidden="true">&#10022;</span>
          {t('search.agentic.nudge.button')}
        </Button>
        <Button
          basic
          className="agentic-search__nudge-dismiss"
          icon="close"
          aria-label={t('search.agentic.nudge.dismiss')}
          title={t('search.agentic.nudge.dismiss')}
          onClick={() => setShowAgenticNudge(false)}
        />
      </div>
    );
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
      {isAgenticSearchType(visibleSearchType) ? (
        <Button basic size="small" icon="arrow left" content={t('search.agentic.backToRegular')} onClick={() => handleSearchTypeChange(SEARCH_TYPES.REGULAR)} />
      ) : (
        <Button.Group size="small">
          <Button active>{t('search.types.regular')}</Button>
          <Button onClick={() => handleSearchTypeChange(SEARCH_TYPES.AGENTIC_RAPID, true)}>
            {t('search.types.agentic')}
          </Button>
        </Button.Group>
      )}
      <Label basic color="blue" className="margin-left-8 margin-right-8">
        {t('search.types.beta')}
      </Label>
      {isAgenticSearchType(visibleSearchType) && (
        <Container className="description padding-top-8" textAlign="right">
          {t('search.types.agenticBeta')}
        </Container>
      )}
    </Container>
  );

  const renderAgenticLoginPrompt = () => (
    <Container className="padded">
      <Message info icon>
        <Icon name="user circle outline" />
        <Message.Content>
          <Message.Header>{t('search.agentic.loginRequired.title')}</Message.Header>
          <p>{t('search.agentic.loginRequired.message')}</p>
          <Button
            basic
            color="blue"
            icon="user circle outline"
            content={t('search.agentic.loginRequired.button')}
            onClick={login}
          />
        </Message.Content>
      </Message>
    </Container>
  );

  const getAgenticStatusText = status => {
    if (!status) {
      return t('search.agentic.status.pending');
    }

    if (status.state === 'canceled' || status.phase === 'canceled') {
      return t('search.agentic.status.canceled');
    }

    if (status.phase === 'running_tool') {
      return t(`search.agentic.status.tools.${status.tool_name}`, {
        defaultValue: t('search.agentic.status.tools.usingTool')
      });
    }

    if (status.phase === 'thinking' && !status.query_analyzed) {
      return t('search.agentic.status.initializingAgent');
    }

    if (status.phase === 'thinking') {
      const variants = t('search.agentic.status.thinking', { returnObjects: true });
      return Array.isArray(variants) ? variants[Math.floor(Math.random() * variants.length)] : variants;
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

  const getAgenticStatusLines = status => {
    const lines = [];

    if (status?.query_analyzed) {
      lines.push({ key: 'query-analyzed', text: t('search.agentic.progress.queryAnalyzed'), icon: 'check circle', checked: true });
    }

    if (status?.has_potentially_good_results) {
      lines.push({ key: 'good-results', text: t('search.agentic.progress.goodCandidates'), icon: 'check circle', checked: true });
    } else if (status?.has_any_results) {
      lines.push({ key: 'initial-results', text: t('search.agentic.progress.initialResults'), icon: 'search' });
    }

    if (status?.may_take_longer) {
      lines.push({ key: 'may-take-longer', text: t('search.agentic.progress.mayTakeLonger'), icon: 'info circle' });
    }

    if (status?.near_finish) {
      lines.push({ key: 'near-finish', text: t('search.agentic.progress.nearFinish'), icon: 'hourglass half' });
    }

    const isFailed = status?.state === 'failed' || status?.phase === 'error';

    // Keep a live line from the current backend phase/tool so progress changes between milestone flags.
    lines.push({
      key    : 'current',
      text   : getAgenticStatusText(status),
      icon   : isFailed ? 'warning sign' : 'circle notched',
      loading: !isFailed
    });

    return lines;
  };

  const renderAgenticStatus = (isFollowup = false) => {
    const hasErrorStatus = reasoningStatus?.phase === 'error' || reasoningStatus?.state === 'failed';
    const hasCanceledStatus = reasoningStatus?.phase === 'canceled' || reasoningStatus?.state === 'canceled';
    const hasEmptyErrorStatus = !wip && !hasCanceledStatus && !!reasoningResult && !reasoningResult?.no_results && currentAgenticResults.length === 0;
    const hasTemporaryErrorStatus = hasErrorStatus || hasEmptyErrorStatus;
    const canCancel = wip && !hasErrorStatus && !hasCanceledStatus && !!reasoningStatus?.session_id;
    const canFinishNow = canCancel && !isRapidAgenticSearch && reasoningStatus?.has_draft_results;
    const canRetry = hasTemporaryErrorStatus;
    const statusMessage  = hasTemporaryErrorStatus ? t('search.agentic.summaryFallback.temporaryError') : null;
    const statusLines = getAgenticStatusLines(reasoningStatus);

    if (!isAgenticSearch || (!wip && !hasTemporaryErrorStatus && !hasCanceledStatus)) {
      return null;
    }

    return (
      <div
        ref={isFollowup ? followupStatusRef : null}
        className={`agentic-search__status-anchor${isFollowup ? ' agentic-search__status-anchor--followup' : ''}`}
      >
        <Container fluid={isFollowup} className={isFollowup ? '' : 'padded'}>
          <Message warning={hasTemporaryErrorStatus} info={!hasTemporaryErrorStatus} icon className="agentic-search__status-message">
            <div className="agentic-search__status-visual" aria-hidden="true">
              {hasTemporaryErrorStatus ? (
                <Icon name="clock outline" className="agentic-search__status-error-icon" />
              ) : hasCanceledStatus ? (
                <Icon name="stop circle outline" className="agentic-search__status-canceled-icon" />
              ) : (
                <>
                  <Icon name="book" className="agentic-search__status-book" />
                  <Icon name="search" className="agentic-search__status-search" />
                </>
              )}
            </div>
            <Message.Content>
              <div className="agentic-search__status-heading">
                <Message.Header>
                  {hasCanceledStatus ? getAgenticStatusText(reasoningStatus) : t('search.agentic.statusTitle')}
                </Message.Header>
                {(canFinishNow || canCancel || canRetry) && (
                  <div className="agentic-search__status-actions">
                    {canRetry && (
                      <Button
                        basic
                        compact
                        size="mini"
                        icon="redo"
                        content={t('buttons.retry')}
                        onClick={() => dispatch(isFollowup && reasoningStatus?.query
                          ? actions.reasoningFollowup({ query: reasoningStatus.query })
                          : actions.search())}
                      />
                    )}
                    {canFinishNow && (
                      <Button
                        basic
                        compact
                        size="mini"
                        icon="forward"
                        content={t('search.agentic.finishNowButton')}
                        onClick={() => dispatch(actions.reasoningFinishNow())}
                      />
                    )}
                    {canCancel && (
                      <Button
                        basic
                        compact
                        size="mini"
                        icon="stop circle outline"
                        content={t('buttons.cancel')}
                        onClick={() => dispatch(actions.reasoningCancel())}
                      />
                    )}
                  </div>
                )}
              </div>
              {!hasCanceledStatus && !hasTemporaryErrorStatus && (
                <div className="agentic-search__status-lines">
                  {statusLines.map(line => (
                    <div key={line.key} className="agentic-search__status-line">
                      <Icon name={line.icon} loading={line.loading} className={line.checked ? 'is-checked' : ''} />
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {statusMessage && (
                <p className="agentic-search__status-error">{statusMessage}</p>
              )}
              {isFollowup && reasoningStatus?.query && (
                <p className="agentic-search__status-query">
                  <span className="agentic-search__status-query-label">{t('search.agentic.followupTitle')}:</span>
                  {' '}
                  {reasoningStatus.query}
                </p>
              )}
            </Message.Content>
          </Message>
        </Container>
      </div>
    );
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

  // Match the regular-search behavior: only result types that land on searchable text content get highlight deep links.
  const supportsAgenticHighlightLinks = linkContentType => (
    linkContentType === CT_SOURCE
    || IsUnitContentType(linkContentType)
    || IsCollectionContentType(linkContentType)
  );

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

  const renderAgenticHighlight = highlight => {
    const text = highlight?.text || '';
    const nodes = [];
    const regex = /<em\b[^>]*>([\s\S]*?)<\/em>/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [, emphasizedText] = match;
      const { index } = match;
      const { lastIndex: nextLastIndex } = regex;

      if (index > lastIndex) {
        nodes.push(text.slice(lastIndex, index));
      }

      nodes.push(<span key={nodes.length} className="agentic-search__highlight-emphasis">{emphasizedText}</span>);
      lastIndex = nextLastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  // Agentic highlight deep links should mirror the backend source: only transcript/source content snippets are clickable.
  const isAgenticHighlightLinkable = highlight => ['content', 'content.language', 'content_language'].includes(highlight?.field);

  const renderAgenticHighlightLink = (highlight, index, to, linkContentType) => {
    if (!to || !supportsAgenticHighlightLinks(linkContentType) || !isAgenticHighlightLinkable(highlight)) {
      return renderAgenticHighlight(highlight);
    }

    const highlightTo = buildHighlightLinkTarget(to, highlight.text, linkContentType);
    if (!highlightTo) {
      return renderAgenticHighlight(highlight);
    }

    const languageQuery = linkContentType === CT_SOURCE
      ? { source_language: uiLang }
      : (IsUnitContentType(linkContentType) || IsCollectionContentType(linkContentType))
        ? { language: uiLang }
        : {};

    const highlightToInUILanguage = {
      ...highlightTo,
      search: [highlightTo.search, stringify(languageQuery)].filter(Boolean).join('&')
    };

    return (
      <Link
        key={`agenticHighlightLink_${index}`}
        className="hover-under-line"
        to={highlightToInUILanguage}
      >
        {renderAgenticHighlight(highlight)}
      </Link>
    );
  };

  const renderAgenticContent = (result, highlights, to, linkContentType) => {
    if (!result.description && !result.reason && highlights.length === 0) {
      return null;
    }

    const hasHighlights = highlights.length > 0;

    return (
      <div className="agentic-search__result-content">
        {hasHighlights && (
          <div className="agentic-search__result-line">
            <span className="agentic-search__result-label">{t('search.agentic.highlights')}:</span>
            {' '}
            {highlights.slice(0, 3).map((highlight, i) => (
              <React.Fragment key={i}>
                {i > 0 && ' | '}
                {renderAgenticHighlightLink(highlight, i, to, linkContentType)}
              </React.Fragment>
            ))}
          </div>
        )}
        {!hasHighlights && result.description && <div className="agentic-search__result-line">{result.description}</div>}
        {result.reason && (
          <div className="agentic-search__result-line">
            <span className="agentic-search__result-label">{t('search.agentic.reason')}:</span>
            {' '}
            {result.reason}
          </div>
        )}
      </div>
    );
  };

  const getAgenticHighlights = result => (
    Array.isArray(result.highlights)
      ? result.highlights.reduce((acc, highlight) => {
        if (typeof highlight === 'string') {
          const text = highlight.trim();
          if (text) {
            acc.push({ field: '', text });
          }

          return acc;
        }

        const text = `${highlight?.text || ''}`.trim();
        if (text) {
          acc.push({ field: highlight?.field || '', text });
        }

        return acc;
      }, [])
      : []
  );

  const renderAgenticHit = (result, rank) => {
    const { contentType, linkContentType } = getAgenticResultMeta(result);
    const to          = getAgenticLink(result, linkContentType);
    const contentTypeLabel = contentType
      ? t(`constants.content-types.${contentType}`, { defaultValue: contentType })
      : '';
    const programName      = result.program_name ? `${result.program_name}`.trim() : '';
    const collectionTitle  = [contentTypeLabel, programName].filter(Boolean).join(' | ');
    const highlights       = getAgenticHighlights(result);

    return <SearchResultOneItem
      key={`${result.mdb_uid}_${rank}`}
      id={`${result.mdb_uid}_${rank}`}
      title={result.title || result.mdb_uid}
      link={to}
      logo={renderAgenticLogo(result, contentType, contentTypeLabel, to)}
      content={renderAgenticContent(result, highlights, to, linkContentType)}
      collectionTitle={collectionTitle}
      date={result.date}
      click={() => null}
    />;
  };

  const renderAgenticTweetGroup = (tweetResults, startRank) => {
    const tweets = tweetResults.map(result => ({
      tweet    : agenticTweetsById[result.mdb_uid],
      highlights: getAgenticHighlights(result),
      result
    }));

    if (tweets.some(item => !item.tweet)) {
      return tweetResults.map((result, offset) => renderAgenticHit(result, startRank + offset));
    }

    return (
      <div
        key={tweetResults.map(result => result.mdb_uid).join('_')}
        className="agentic-search__tweet-result"
      >
        <Card.Group className="search__cards" itemsPerRow={3} stackable>
          {tweets.map(({ tweet, highlights, result }) => (
            <Card key={result.mdb_uid} className="bg_hover_grey home-twitter" raised>
              <Card.Content>
                <Feed className="min-height-200">
                  <TwitterFeed snippetVersion withDivider={false} twitter={tweet} highlight={highlights[0]?.text} />
                </Feed>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  };

  const renderAgenticResultsList = results => {
    const nodes = [];

    for (let index = 0; index < results.length; index += 1) {
      const result = results[index];
      if (!isAgenticTweetResult(result)) {
        nodes.push(renderAgenticHit(result, index));
        continue;
      }

      const tweetResults = [result];
      while (index + 1 < results.length && isAgenticTweetResult(results[index + 1])) {
        tweetResults.push(results[index + 1]);
        index += 1;
      }

      const groupNode = renderAgenticTweetGroup(tweetResults, index - tweetResults.length + 1);
      if (Array.isArray(groupNode)) {
        nodes.push(...groupNode);
      } else {
        nodes.push(groupNode);
      }
    }

    return nodes;
  };

  const handleReasoningFollowup = () => {
    const query = followupQuery.trim();
    if (!query || wip) {
      return;
    }

    dispatch(actions.reasoningFollowup({ query }));
    setFollowupQuery('');
    shouldScrollToCompletedFollowupRef.current = true;
  };

  const handleDeeperSearch = () => {
    const deeperQuery = t('search.agentic.searchDeeper').trim();
    if (!deeperQuery || wip) {
      return;
    }

    dispatch(actions.setSearchType(SEARCH_TYPES.AGENTIC));
    dispatch(actions.reasoningFollowup({ query: deeperQuery }));
    setScrollToFollowupStatus(true);
    shouldScrollToCompletedFollowupRef.current = true;
  };

  const renderAgenticFollowup = () => {
    if (wip) {
      return null;
    }

    const remaining   = reasoningResult?.followups_remaining || 0;
    const canFollowup = !!reasoningResult?.session_id && remaining > 0;
    const canSearchDeeper = canFollowup && reasoningResult?.is_rapid;
    const showSearchDeeperHint = isSearchDeeperHintVisible && canSearchDeeper && previousAgenticSearches.length === 0;

    return (
      <div className="agentic-search__followup" onClick={() => setSearchDeeperHintVisible(false)}>
        {canFollowup ? (
          <>
            <div className="agentic-search__followup-controls">
              <textarea
                className="agentic-search__followup-input"
                rows="1"
                value={followupQuery}
                placeholder={t('search.agentic.followupPlaceholder')}
                onChange={e => setFollowupQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReasoningFollowup();
                  }
                }}
              />
              <div className="agentic-search__followup-toolbar">
                <div className={`agentic-search__advanced-option${isRapidAgenticSearch ? '' : ' is-active'}`}>
                  <span className="agentic-search__brain-icon" aria-hidden="true">&#129504;</span>
                  <span>{t('search.agentic.advancedThinking')}</span>
                  <Checkbox
                    toggle
                    checked={!isRapidAgenticSearch}
                    aria-label={t('search.agentic.advancedThinking')}
                    title={t('search.agentic.advancedThinking')}
                    onChange={() => dispatch(actions.setSearchType(
                      isRapidAgenticSearch ? SEARCH_TYPES.AGENTIC : SEARCH_TYPES.AGENTIC_RAPID
                    ))}
                  />
                </div>
                {canSearchDeeper && (
                  <div className="agentic-search__deeper-action">
                    {showSearchDeeperHint && (
                      <span id="agentic-search-deeper-hint" role="tooltip" className="agentic-search__deeper-hint">
                        {t('search.agentic.searchDeeperHint')}
                      </span>
                    )}
                    <Button
                      basic
                      compact
                      className="agentic-search__deeper-search"
                      aria-describedby={showSearchDeeperHint ? 'agentic-search-deeper-hint' : undefined}
                      title={t('search.agentic.searchDeeper')}
                      onClick={handleDeeperSearch}
                    >
                      <span className="agentic-search__brain-icon" aria-hidden="true">&#129504;</span>
                      <span>{t('search.agentic.searchDeeper')}</span>
                    </Button>
                  </div>
                )}
                <Button
                  circular
                  className="agentic-search__followup-send"
                  icon="arrow up"
                  aria-label={t('search.agentic.followupButton')}
                  title={t('search.agentic.followupButton')}
                  disabled={!followupQuery.trim()}
                  onClick={handleReasoningFollowup}
                />
              </div>
              <div className="agentic-search__followup-hint">
                {t('search.agentic.followupsRemaining', { count: remaining })}
              </div>
            </div>
          </>
        ) : (
          <Message info content={t('search.agentic.followupsExhausted')} />
        )}
      </div>
    );
  };

  const getAgenticSummaryMessage = (searchResult, results, resultQuery, showFallback = false) => {
    if (searchResult?.no_results) {
      return {
        header : t('search.agentic.summaryFallback.title'),
        content: t('search.agentic.summaryFallback.noResults', { query: resultQuery })
      };
    }

    if (searchResult?.summary) {
      return { header: t('search.agentic.summary'), content: searchResult.summary };
    }

    if (!showFallback && (
      wip
      || isShowingRapidAgenticResults
      || reasoningStatus?.state !== 'completed'
    )) {
      return null;
    }

    const relevanceCounts = (Array.isArray(results) ? results : []).reduce((acc, result) => {
      switch (result?.relevance) {
        case 'highly_relevant':
          acc.highlyRelevant += 1;
          break;
        case 'relevant':
          acc.relevant += 1;
          break;
        case 'can_be_relevant':
          acc.possible += 1;
          break;
        default:
          break;
      }

      return acc;
    }, { highlyRelevant: 0, relevant: 0, possible: 0 });

    const findings = [
      relevanceCounts.highlyRelevant > 0
        ? t('search.agentic.summaryFallback.highlyRelevant', { count: relevanceCounts.highlyRelevant })
        : null,
      relevanceCounts.relevant > 0
        ? t('search.agentic.summaryFallback.relevant', { count: relevanceCounts.relevant })
        : null,
      relevanceCounts.possible > 0
        ? t('search.agentic.summaryFallback.possible', { count: relevanceCounts.possible })
        : null
    ].filter(Boolean);

    if (findings.length === 0) {
      return null;
    }

    if (relevanceCounts.highlyRelevant === 0 && relevanceCounts.relevant === 0 && relevanceCounts.possible > 0) {
      return {
        header : t('search.agentic.summaryFallback.title'),
        content: t('search.agentic.summaryFallback.messagePossibleOnly', {
          count        : relevanceCounts.possible,
          improveSearch: t('search.agentic.followupTitle')
        })
      };
    }

    let findingsText = findings[0];
    if (findings.length === 2) {
      findingsText = `${findings[0]} ${t('search.agentic.summaryFallback.and')} ${findings[1]}`;
    } else if (findings.length === 3) {
      findingsText = `${findings[0]}, ${findings[1]}, ${t('search.agentic.summaryFallback.and')} ${findings[2]}`;
    }

    return {
      header : t('search.agentic.summaryFallback.title'),
      content: t('search.agentic.summaryFallback.message', {
        findingsText,
        improveSearch: t('search.agentic.followupTitle')
      })
    };
  };

  const renderAgenticResults = query => {
    const showRapidResultsBanner = isShowingRapidAgenticResults && wip && reasoningStatus?.state !== 'completed';
    const isFollowupStatus = reasoningRequestKind === 'followup';
    const isRunningFollowup = isFollowupStatus && wip && !!reasoningResult;
    const showRapidFollowupResults = isRunningFollowup && isShowingRapidAgenticResults;
    const currentSearch = reasoningResult || {
      query: reasoningStatus?.query || query,
      results: currentAgenticResults
    };
    const rapidFollowupSearch = {
      display_query: reasoningStatus?.query,
      results      : rapidAgenticResults
    };

    const renderAgenticTurn = (searchResult, results, isCurrent = false, turnKey = 'current') => {
      const resultQuery = searchResult?.display_query || searchResult?.query || query;
      const shouldHideAgenticResults = !!searchResult?.no_results;
      const summaryMessage = getAgenticSummaryMessage(searchResult, results, resultQuery, !isCurrent);
      const isCompletedTurn = !isCurrent || reasoningStatus?.state === 'completed';

      return (
        <section
          ref={isCurrent ? currentTurnRef : null}
          className="agentic-search__turn"
          key={`${searchResult?.session_id || resultQuery}_${turnKey}`}
        >
          <Header as="h3" className="agentic-search__turn-query" content={resultQuery} />
          {summaryMessage && (
            <Message
              info
              header={summaryMessage.header}
              content={summaryMessage.content}
            />
          )}
          {results.length === 0 && isCompletedTurn && !wip && !summaryMessage && (
            <div>{t('search.agentic.no-results', { query: resultQuery })}</div>
          )}
          {!shouldHideAgenticResults && results.length > 0 && (
            <div className="agentic-search__results">{renderAgenticResultsList(results)}</div>
          )}
        </section>
      );
    };

    const rapidResultsBanner = showRapidResultsBanner && (
      <div className="margin-bottom-8">
        <Header as="h4" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>{t('search.agentic.rapidResultsLive.title')}</span>
          <Icon name="circle notched" loading color="blue" />
        </Header>
        <div className="description">
          {t('search.agentic.rapidResultsLive.message')}
        </div>
      </div>
    );

    return renderSearchFrame(
      <>
        {!isFollowupStatus && renderAgenticStatus()}
        <Container className="padded agentic-search__conversation">
          <div className="agentic-search__ai-note">
            <Icon name="info circle" />
            <span className="agentic-search__ai-note-title">{t('search.agentic.warningTitle')}:</span>
            {' '}
            {t('search.agentic.warning')}
          </div>
          {!showRapidFollowupResults && rapidResultsBanner}
          {previousAgenticSearches.map((search, index) => renderAgenticTurn(search, search?.results || [], false, `previous_${index}`))}
          {renderAgenticTurn(
            currentSearch,
            showRapidFollowupResults ? storedAgenticResults : currentAgenticResults,
            !isRunningFollowup,
            isRunningFollowup ? 'active_previous' : 'current'
          )}
          {isFollowupStatus && renderAgenticStatus(true)}
          {showRapidFollowupResults && rapidResultsBanner}
          {showRapidFollowupResults && renderAgenticTurn(rapidFollowupSearch, rapidAgenticResults, true, 'rapid_followup')}
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

  if (shouldShowAgenticLoginPrompt) {
    return renderSearchFrame(renderAgenticLoginPrompt());
  }

  const wipErr = WipErr({ wip: !isAgenticSearch && (wip || !areSourcesLoaded || !areTagsLoaded), err: isAgenticSearch ? null : err, t });
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
    if (!reasoningResult && !isShowingRapidAgenticResults && reasoningStatus?.state !== 'failed' && reasoningStatus?.phase !== 'error') {
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
      {renderAgenticNudge()}
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
