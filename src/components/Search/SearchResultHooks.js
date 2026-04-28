import { clsx } from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { canonicalCollection } from '../../helpers/utils';
import { actions as listsActions } from '../../redux/modules/lists';
import { actions as publicationActions } from '../../redux/modules/publications';
import TwitterFeed from '../Sections/Publications/tabs/Twitter/Feed';

import {
  CT_ARTICLE,
  CT_BLOG_POST,
  CT_LESSONS_SERIES,
  CT_VIDEO_PROGRAM,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_CONTENT_TYPE,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT,
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_HIT_TYPE_LESSONS,
  SEARCH_INTENT_HIT_TYPE_PROGRAMS,
  SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  iconByContentTypeMap
} from '../../helpers/consts';
import { SectionLogo } from '../../helpers/images';
import { canonicalLink, intentSectionLink, landingPageSectionLink } from '../../helpers/links';
import { stringify } from '../../helpers/url';
import {
  filtersGetFiltersSelector,
  lessonsGetSeriesBySourceIdSelector,
  lessonsGetSeriesByTagIdSelector,
  lessonsGetWipSelector,
  listsGetNamespaceStateSelector,
  mdbGetDenormContentUnitSelector,
  mdbNestedDenormCollectionWUnitsSelector,
  publicationsGetTweetsErrorSelector,
  publicationsGetTweetsWipSelector,
  publicationsGetTwitterSelector,
  recommendedGetViewsSelector,
  settingsGetLeftRightByDirSelector,
  settingsGetUIDirSelector,
  settingsGetUILangSelector
} from '../../redux/selectors';
import Link from '../Language/MultiLanguageLink';
import UnitLogo from '../shared/Logo/UnitLogo';
import TooltipIfNeed from '../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../shared/UnitLogoWithDuration';
import { getWipErr } from '../shared/WipErr/WipErr';

const PATH_SEPARATOR                 = ' > ';
const MIN_NECESSARY_WORDS_FOR_SEARCH = 4;

const SearchHeader = ({ as: Tag = 'h3', content, children, className = '', ...rest }) => (
  <Tag className={`large font-bold ${className}`} {...rest}>{content || children}</Tag>
);

const SearchContainer = ({ content, children, ...rest }) => (
  <div {...rest}>{content || children}</div>
);

const titleFromHighlight = (highlight, defVal) => {
  let prop = ['title', 'title_language'].find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
  prop     = highlight && highlight[prop] ? highlight[prop].join(PATH_SEPARATOR) : defVal;

  if (!prop) {
    return null;
  }

  const titleArr = prop.split(PATH_SEPARATOR);
  let title      = `${titleArr.splice(-1)}`;
  if (titleArr.length > 0) {
    title += ` / ${titleArr.join(PATH_SEPARATOR)}`;
  }

  return <span dangerouslySetInnerHTML={{ __html: title }} />;
};

// Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
const snippetFromHighlight = (highlight, props) => {
  const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

  if (!prop) {
    return null;
  }

  const __html = `...${highlight[prop].join('.....')}...`;
  return <span dangerouslySetInnerHTML={{ __html }} />;
};

const clearStringForLink = str => str.replace(/(\r?\n|\r){1,}/g, ' ').replace(/<.+?>/gi, '');

const getMediaLanguage = filters => {
  if (!filters) {
    return null;
  }

  let mediaLanguage;
  const filteredLanguages = filters.find(f => f.name === 'language-filter');
  if (filteredLanguages && filteredLanguages.values.length > 0) {
    mediaLanguage = filteredLanguages.values[0];
  }

  return mediaLanguage;
};

const highlightWrapToLink = (__html, index, to) => {
  const searchArr = clearStringForLink(__html).split(' ');

  const search = {
    srchstart: searchArr.slice(0, MIN_NECESSARY_WORDS_FOR_SEARCH).join(' '),
    srchend: searchArr.slice(-1 * MIN_NECESSARY_WORDS_FOR_SEARCH).join(' '),
    highlightAll: true
  };

  return (<Link
    key={`highlightLink_${index}`}
    //onClick={() => this.logClick(...logLinkParams)}
    className={'hover-under-line'}
    to={{ ...to, search: [to.search, stringify(search)].filter(x => !!x).join('&') }}>
    <span dangerouslySetInnerHTML={{ __html: `...${__html}...` }} />
  </Link>);
};

const snippetFromHighlightWithLink = (to, highlight, props) => {
  const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

  if (!prop) {
    return null;
  }

  const __html = highlight[prop].map((h, i) => highlightWrapToLink(h, i, to));
  return <span>{__html}</span>;
};

const renderSnippet = (to, highlight, defaultDescription, t) => {
  const description = snippetFromHighlight(highlight, ['description', 'description_language']);
  if (description) {
    return (<div><strong>{t('search.result.description')} : {' '}</strong>{description}</div>);
  }

  const content = to ?
    snippetFromHighlightWithLink(to, highlight, ['content', 'content_language']) :
    snippetFromHighlight(highlight, ['content', 'content_language']);
  if (content) {
    return (<div><strong>{t('search.result.transcript')} : {' '}</strong>{content}</div>);
  }

  return defaultDescription;
};

const iconByContentType = (type, t, to) => {
  const icon    = iconByContentTypeMap.get(type) || null;
  const content = <div className="icon">
    <SectionLogo name={icon} width="70" height="70" />
    <span>{t(`constants.content-types.${type}`)}</span>
  </div>;

  if (!to)
    return content;

  return (
    <Link to={to}>
      {content}
    </Link>
  );
};

const searchResultClick = (chronicles, dispatch, clickData) => link => {
  chronicles.searchSelected({ ...clickData, link });
};

export const SearchResultCU = ({ cu, highlight = {}, clickData, hideContent = false, onlyViewsAndDate = false }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommendedGetViewsSelector(state, cu.id));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const mediaLanguage = getMediaLanguage(filters);

  const to  = canonicalLink(cu, mediaLanguage);
  const ccu = canonicalCollection(cu) || {};
  // const collectionLink = canonicalLink(ccu, mediaLanguage);

  const logo = cu.content_type === CT_ARTICLE ?
    iconByContentType(cu.content_type, t, to) : <UnitLogoWithDuration unit={cu} width={144} />;

  const props = {
    id: cu.id,
    title: titleFromHighlight(highlight, cu.name),
    link: to,
    logo,
    content: hideContent ? '' : renderSnippet(to, highlight, cu.description, t),
    part: onlyViewsAndDate ? undefined : Number(ccu.ccuNames?.[cu.id]),
    // Does not work for articles (should load canonical collection with cuIDs => after redirect into and back the count is correct)
    // parts: ccu?.cuIDs?.length,
    date: cu.film_date,
    views,
    collectionTitle: onlyViewsAndDate ? undefined : ccu.name,
    // collectionLink,
    t,
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultPost = ({ id, post, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommendedGetViewsSelector(state, id));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  // Should I replace POST with CT_BLOG_POST everywhere?
  const link          = canonicalLink({ id, content_type: 'POST' }, mediaLanguage);

  const props = {
    id,
    title: titleFromHighlight(highlight, post.title),
    link,
    logo: iconByContentType(CT_BLOG_POST, t, link),
    content: renderSnippet(null /* No highlight links for posts. */, highlight, post.content, t),
    date: post.created_at || '',
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultCollection = ({ c, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommendedGetViewsSelector(state, c.id));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  const to            = canonicalLink(c, mediaLanguage);

  const logo = c.content_type !== CT_VIDEO_PROGRAM ? iconByContentType(c.content_type, t, to) :
    <div style={{ minWidth: 144 }}><UnitLogo collectionId={c.id} width={144} /></div>;

  const props = {
    id: c.id,
    title: titleFromHighlight(highlight, c.name),
    link: to,
    logo,
    content: renderSnippet(to, highlight, c.description, t),
    parts: c.content_units.length,
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultSource = ({ id, title, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommendedGetViewsSelector(state, id));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filtersGetFiltersSelector(state, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  const to            = canonicalLink({ id, content_type: 'SOURCE' }, mediaLanguage);

  const props = {
    id,
    title: titleFromHighlight(highlight, title),
    link: to,
    logo: iconByContentType('sources', t, to),
    content: renderSnippet(to, highlight, null /* No default description */, t),
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultLandingPage = ({ landingPage, filterValues, clickData }) => {
  const { t } = useTranslation();

  const to         = landingPageSectionLink(landingPage, filterValues);
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  const linkTitle         = SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT[landingPage] || 'home.sections';
  const valuesTitleSuffix = (filterValues && filterValues.filter(filterValue => filterValue.name !== 'text').map(filterValue => filterValue.origin || filterValue.value).join(' ')) || '';
  const subText           = t(SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT[landingPage]);

  const props = {
    id: landingPage,
    title: `${t(linkTitle)} ${valuesTitleSuffix}`,
    link: to,
    logo: iconByContentType(SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_CONTENT_TYPE[landingPage], t, to),
    content: renderSnippet(to, null /* No highlights for landing pages. */, subText, t),
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultOneItem = props => {
  const
    {
      id,
      title,
      link,
      logo,
      content,
      part,
      parts,
      date,
      views,
      collectionTitle,
      collectionLink,
      click
    }         = props;
  const { t } = useTranslation();

  const description = [];
  collectionTitle && description.push(collectionTitle);
  part && description.push(t('pages.unit.info.episode', { name: part }));
  parts && description.push(`${parts} ${t('pages.collection.items.programs-collection')}`);
  date && description.push(t('values.date', { date }));
  !!views && views > 0 && description.push(t('pages.unit.info.views', { views }));

  return (
    <div key={id} className="media_item list-none">
      <div className="media_item__logo">{logo}</div>
      <div className="media_item__content">
        <TooltipIfNeed text={title} Component={SearchHeader} as={Link} to={link} onClick={() => click(link)} content={title} />
        {content && (<TooltipIfNeed text={content} Component={SearchContainer} content={content} />)}
        <div className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
          {collectionLink && (<span className="opacity_1">
            <Link as={'a'} to={collectionLink} onClick={() => click(collectionLink)}>
              {/* ARTICLES should have different text, then "To all episodes..." should be "To all articles..." */}
              {t('programs.list.show_all')}
            </Link>
          </span>)}
        </div>
      </div>
    </div>
  );
};

export const SearchResultIntent = ({ id, type, index, clickData }) => {
  const { t }      = useTranslation();
  const chronicles = useContext(ClientChroniclesContext);
  const namespace  = `intents_${id}_${type}`;
  const dispatch   = useDispatch();
  useEffect(() => {
    const params = {
      content_type: type,
      page_size: 3,
      [index === SEARCH_INTENT_INDEX_SOURCE ? 'source' : 'tag']: id
    };
    dispatch(listsActions.fetchList(namespace, 1, params));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const { items, wip, err, total } = useSelector(state => listsGetNamespaceStateSelector(state, namespace));
  // MAP items to SearchResultOneItem
  const cuItems                    = useSelector(state => (items || []).map(x => mdbGetDenormContentUnitSelector(state, x)));

  const section    = SEARCH_INTENT_SECTIONS[type];
  const intentType = SEARCH_INTENT_NAMES[index];
  const filterName = SEARCH_INTENT_FILTER_NAMES[index];

  const logo        = <SectionLogo name={type} height="50" width="50" />;
  const link        = intentSectionLink(section, [{ name: filterName, values: [id] }]);
  const description = t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`);

  let resultsType = '';
  switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      resultsType = SEARCH_INTENT_HIT_TYPE_PROGRAMS;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      resultsType = SEARCH_INTENT_HIT_TYPE_LESSONS;
      break;
  }

  const props = {
    logo,
    link,
    resultsType,
    description,
    wip,
    err,
    items: cuItems.map(cu => cu && <SearchResultCU cu={cu} hideContent={true} onlyViewsAndDate={true} key={cu.id} />),
    parts: total,
    click: searchResultClick(chronicles, dispatch, clickData)
  };

  return <SearchResultManyItems {...props} />;
};

export const SearchResultManyItems = (
  {
    logo,
    link,
    description,
    parts,
    resultsType,
    wip,
    err,
    items,
    click
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const wipError = getWipErr(wip || items.some(item => !item), err);

  return (
    <div className="media_item list-none">
      <div>
        <div className={clsx(' px-4 ', { 'padding_r_l_0': !isMobileDevice })}>
          <h2 className="flex items-end gap-1">
            <span className="inline-block align-bottom">{logo}</span>
            &nbsp;
            <span>{description}</span>
          </h2>
        </div>
        {wipError}
        {
          !wipError && (<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map(item => <div key={item.id}>{item}</div>)}
          </div>)
        }
        <div className="no-border  text-right w-full">
          <span className="material-symbols-outlined text-base" style={{ display: 'inline' }}>task_alt</span>
          <Link to={link} onClick={() => click(link)}><span>{`${t('search.showAll')} ${parts} ${t(`search.${resultsType}`)}`}</span></Link>
        </div>
      </div>
    </div>
  );
};

// Reduce series from all leaf tags/sources.
const getLowestLevelSeries = (series, rootId) => {
  if (!series || !series.length) return null;
  const root = series.find(s => s.parent_id === rootId || (!s.parent_id && !rootId));
  if (root && root.children && root.children.length) {
    return root;
  }

  if (!root || !root.id) return series[series.length - 1];
  return getLowestLevelSeries(series, root.id);
};

const renderSerie = (s, click, link, t) =>
  (
    <Link
      className="link_to_cu border rounded px-2 py-1 small"
      key={s.id}
      to={link}
      onClick={() => click(link)}
      style={{ minWidth: '290px', marginBottom: '0.5em', display: 'flex', justifyContent: 'space-between' }}>
      {s.name}
      &nbsp;
      <span className="margin-right-8 margin-left-8">
        <span className="material-symbols-outlined text-base" style={{ display: 'inline-block' }}>task_alt</span>
        {`${t('search.showAll')} ${s.cuIDs.length} ${t('pages.collection.items.lessons-collection')}`}
      </span>
    </Link>
  );

export const SearchResultSeries = ({ id, type, mdbUid, clickData }) => {
  const { t }                        = useTranslation();
  const chronicles                   = useContext(ClientChroniclesContext);
  const dispatch                     = useDispatch();
  const nestedDenormCollectionWUnits = useSelector(mdbNestedDenormCollectionWUnitsSelector);
  const getSerieBySource             = useSelector(state => lessonsGetSeriesBySourceIdSelector(state, state, state));
  const getSerieByTag                = useSelector(state => lessonsGetSeriesByTagIdSelector(state, state, state));
  const filters                      = useSelector(state => filtersGetFiltersSelector(state, 'search'));

  const click                            = searchResultClick(chronicles, dispatch, clickData);
  const logo                             = <SectionLogo name={'lessons'} height="50" width="50" />;
  const { lectures: wipL, series: wipS } = useSelector(lessonsGetWipSelector);
  const isByTag                          = type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG;
  const getSerie                         = isByTag ? getSerieByTag : getSerieBySource;
  const series                           = id.split('_').map(getSerie);
  const s                                = getLowestLevelSeries(series);

  if (s.collections.length === 1) {
    const c = nestedDenormCollectionWUnits(s.collections[0].id);
    return (
      <SearchResultCollection c={c} clickData={clickData} />
    );
  }

  const collections = s.collections.filter(c => c.id !== mdbUid);
  const found       = s.collections.find(c => c.id === mdbUid);
  if (found) {
    collections.unshift(found);
  }

  const wipError = getWipErr(wipL || wipS || collections.some(c => !c), null);

  // If filter used for specific language, make sure the link will redirect to that language.
  const mediaLanguage = getMediaLanguage(filters);

  return (
    <div className="media_item list-none">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="large font-bold flex items-end gap-1">
            <span className="inline-block align-bottom">{logo}</span>
            &nbsp;
            <span>{t(`constants.content-types.${CT_LESSONS_SERIES}`)}</span>
          </div>
        </div>
        {wipError}
        {!wipError && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginRight: '1em', paddingTop: '1em' }}>
              {collections.map(c => renderSerie(c, click, canonicalLink(c, mediaLanguage), t))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const twitterMapFromState = (state, tweets) => tweets.map(tweet => {
  const content = tweet && tweet.highlight && tweet.highlight.content;
  const mdb_uid = tweet && tweet._source && tweet._source.mdb_uid;
  const twitter = publicationsGetTwitterSelector(state, mdb_uid);
  return { twitter, highlight: content };
});

export const SearchResultTweets = ({ source }) => {
  const { t }              = useTranslation();
  const ids                = source.map(x => x._source.mdb_uid) || [];
  const wip                = useSelector(publicationsGetTweetsWipSelector);
  const err                = useSelector(publicationsGetTweetsErrorSelector);
  const wipError           = getWipErr(wip, err);
  const items              = useSelector(state => twitterMapFromState(state, source));
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const uiLang             = useSelector(settingsGetUILangSelector);
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const leftRight          = useSelector(settingsGetLeftRightByDirSelector);

  const [pageNo, setPageNo] = useState(0);
  const pageSize            = isMobileDevice ? 1 : 3;

  const dispatch = useDispatch();
  useEffect(() => {
    askForData(0, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const askForData = (pageNo, pageSize) => {
    const id = ids.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
    dispatch(publicationActions.fetchTweets('tweets_many', 1, { id }));
  };

  const onScrollChange = pageNo => {
    if (pageNo < 0 || pageSize * pageNo >= ids.length) {
      return;
    }

    setPageNo(pageNo);
    askForData(pageNo, pageSize);
  };

  const onScrollRight = () => onScrollChange(pageNo + 1);
  const onScrollLeft  = () => onScrollChange(pageNo - 1);

  const swipeHandlers          = useSwipeable({
    onSwipedLeft: uiDir === 'rtl' ? onScrollRight : onScrollLeft,
    onSwipedRight: uiDir === 'rtl' ? onScrollLeft : onScrollRight
  });
  const renderItem             = ({ twitter, highlight }) => (
    <div key={twitter.twitter_id} className="bg_hover_grey home-twitter rounded-lg border shadow-md">
      <div className="p-4">
        <div className="min-height-200">
          <TwitterFeed snippetVersion withDivider={false} twitter={twitter} highlight={highlight && highlight[0]} />
        </div>
      </div>
    </div>
  );
  const renderScrollPagination = () => {
    const numberOfPages = Math.round(ids.length / pageSize);
    const pages         = new Array(numberOfPages).fill('a');
    const content       = pages.map((p, i) => (
      <button onClick={() => onScrollChange(i)} key={i} className="bg_transparent border-0 p-1 cursor-pointer">
        <span className={`material-symbols-outlined text-blue-500 small`}>
          {pageNo === i ? 'radio_button_checked' : 'radio_button_unchecked'}
        </span>
      </button>
    ));

    return <div className="no-padding text-center">{content}</div>;
  };

  const renderScrollRight = () => {
    const dir = uiDir === 'rtl' ? 'right' : 'left';
    return pageNo === 0 ? null : (
      <button
        onClick={onScrollLeft}
        className="scroll_tweets rounded-full border large px-2 py-1"
        style={{ [dir]: '5px' }}
      >
        <span className="material-symbols-outlined">
          {dir === 'left' ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    );
  };

  const renderScrollLeft = () => {
    const numberOfPages = Math.round(ids.length / pageSize);

    return (pageNo >= numberOfPages - 1) ? null : (
      <button
        onClick={onScrollRight}
        className="scroll_tweets rounded-full border large px-2 py-1"
        style={{ [leftRight]: '5px' }}
      >
        <span className="material-symbols-outlined">
          {leftRight === 'left' ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    );
  };

  return (
    <div className="media_item list-none">
      <div className="search__block" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-blue-600">{t('home.twitter-title')}</h2>
          { }
          <div className="no-padding no-border">
            <a href={`/${uiLang}/publications/twitter`}>{t('home.all-tweets')}</a>
          </div>
        </div>
        {wipError}
        {!wipError && (
          <div {...swipeHandlers} >
            <div className={`${isMobileDevice ? 'margin-top-8' : null} search__cards grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).filter(x => x && x.twitter).map(renderItem)}
            </div>
          </div>
        )}
        {pageSize < ids.length ? renderScrollLeft() : null}
        {pageSize < ids.length ? renderScrollRight() : null}
        {pageSize < ids.length ? renderScrollPagination() : null}
      </div>
    </div>
  );
};
