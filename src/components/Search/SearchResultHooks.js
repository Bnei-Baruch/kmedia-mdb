import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button, Card, Container, Feed, Grid, Header, Icon, Image, List, Segment, } from 'semantic-ui-react';
import { useSwipeable } from 'react-swipeable';

import TwitterFeed from '../Sections/Publications/tabs/Twitter/Feed';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { canonicalCollection, tracePath } from '../../helpers/utils';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as recommended } from '../../redux/modules/recommended';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { selectors as lessonsSelectors } from '../../redux/modules/lessons';
import { actions as publicationActions, selectors as publicationSelectors } from '../../redux/modules/publications';
import { selectors as settingsSelectors } from '../../redux/modules/settings';

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
  iconByContentTypeMap,
} from '../../helpers/consts';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { SectionLogo } from '../../helpers/images';
import { canonicalLink, landingPageSectionLink, intentSectionLink } from '../../helpers/links';
import { stringify } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';
import TooltipIfNeed from '../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../shared/UnitLogoWithDuration';
import UnitLogo from '../shared/Logo/UnitLogo';
import WipErr from '../shared/WipErr/WipErr';

const PATH_SEPARATOR                 = ' > ';
const MIN_NECESSARY_WORDS_FOR_SEARCH = 4;

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
    highlightAll: true,
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
  const views      = useSelector(state => recommended.getViews(cu.id, state.recommended));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const mediaLanguage = getMediaLanguage(filters);

  const to  = canonicalLink(cu, mediaLanguage);
  const ccu = canonicalCollection(cu) || {};
  // const collectionLink = canonicalLink(ccu, mediaLanguage);

  const logo = cu.content_type === CT_ARTICLE ?
    iconByContentType(cu.content_type, t, to) : <UnitLogoWithDuration unit={cu} width={144} />;

  const props = {
    key: cu.id,
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
    click: searchResultClick(chronicles, dispatch, clickData),
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultPost = ({ id, post, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommended.getViews(id, state.recommended));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  // Should I replace POST with CT_BLOG_POST everywhere?
  const link          = canonicalLink({ id, content_type: 'POST' }, mediaLanguage);

  const props = {
    key: id,
    title: titleFromHighlight(highlight, post.title),
    link,
    logo: iconByContentType(CT_BLOG_POST, t, link),
    content: renderSnippet(null /* No highlight links for posts. */, highlight, post.content, t),
    date: post.created_at || '',
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData),
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultCollection = ({ c, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommended.getViews(c.id, state.recommended));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  const to            = canonicalLink(c, mediaLanguage);

  const logo = c.content_type !== CT_VIDEO_PROGRAM ? iconByContentType(c.content_type, t, to) :
    <div style={{ minWidth: 144 }}><UnitLogo collectionId={c.id} width={144} /></div>;

  const props = {
    key: c.id,
    title: titleFromHighlight(highlight, c.name),
    link: to,
    logo,
    content: renderSnippet(to, highlight, c.description, t),
    parts: c.content_units.length,
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData),
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultSource = ({ id, title, highlight, clickData }) => {
  const { t }      = useTranslation();
  const views      = useSelector(state => recommended.getViews(id, state.recommended));
  const chronicles = useContext(ClientChroniclesContext);
  const dispatch   = useDispatch();

  // If filter used for specific language, make sure the link will redirect to that language.
  const filters       = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const mediaLanguage = getMediaLanguage(filters);
  const to            = canonicalLink({ id, content_type: 'SOURCE' }, mediaLanguage);

  const props = {
    key: id,
    title: titleFromHighlight(highlight, title),
    link: to,
    logo: iconByContentType('sources', t, to),
    content: renderSnippet(to, highlight, null /* No default description */, t),
    views,
    t,
    click: searchResultClick(chronicles, dispatch, clickData),
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
    key: landingPage,
    title: `${t(linkTitle)} ${valuesTitleSuffix}`,
    link: to,
    logo: iconByContentType(SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_CONTENT_TYPE[landingPage], t, to),
    content: renderSnippet(to, null /* No highlights for landing pages. */, subText, t),
    click: searchResultClick(chronicles, dispatch, clickData),
  };

  return <SearchResultOneItem {...props} />;
};

export const SearchResultOneItem = (
  {
    key,
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
    click,
  }
) => {
  const { t } = useTranslation();

  const description = [];
  collectionTitle && description.push(collectionTitle);
  part && description.push(t('pages.unit.info.episode', { name: part }));
  parts && description.push(`${parts} ${t('pages.collection.items.programs-collection')}`);
  date && description.push(t('values.date', { date }));
  !!views && views > 0 && description.push(t('pages.unit.info.views', { views }));

  return (
    <List.Item key={key} className="media_item">
      <div className="media_item__logo">{logo}</div>
      <div className="media_item__content">
        <TooltipIfNeed text={title} Component={Header} as={Link} to={link} onClick={() => click(link)} content={title} />
        {content && (<TooltipIfNeed text={content} Component={Container} content={content} />)}
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
    </List.Item>
  );
};

const getFilterById = (getTagById, getSourceById, index) => {
  switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      return getTagById;
    case SEARCH_INTENT_INDEX_SOURCE:
      return getSourceById;
    default:
      return x => x;
  }
};

export const SearchResultIntent = ({ id, name, type, index, clickData }) => {
  const { t }      = useTranslation();
  const chronicles = useContext(ClientChroniclesContext);
  const namespace  = `intents_${id}_${type}`;
  const dispatch   = useDispatch();
  useEffect(() => {
    const params = {
      content_type: type,
      page_size: 3,
      [index === SEARCH_INTENT_INDEX_SOURCE ? 'source' : 'tag']: id,
    };
    dispatch(listsActions.fetchList(namespace, 1, params));
  }, [dispatch]);
  const { items, wip, err, total } = useSelector(state => lists.getNamespaceState(state.lists, namespace));
  // MAP items to SearchResultOneItem
  const cuItems                    = useSelector(state => (items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)));

  const getTagById    = useSelector(state => tagsSelectors.getTagById(state.tags));
  const getSourceById = useSelector(state => sourcesSelectors.getSourceById(state.sources));

  const section    = SEARCH_INTENT_SECTIONS[type];
  const intentType = SEARCH_INTENT_NAMES[index];
  const filterName = SEARCH_INTENT_FILTER_NAMES[index];

  const logo        = <SectionLogo name={type} height="50" width="50" />;
  const getById     = getFilterById(getTagById, getSourceById, index);
  const link        = intentSectionLink(section, [{ name: filterName, values: [id] }]);
  const description = t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`);

  let resultsType = '';
  const path      = tracePath(getById(id), getById);
  let display     = '';
  switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      display     = path[path.length - 1].label;
      resultsType = SEARCH_INTENT_HIT_TYPE_PROGRAMS;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      display     = path.map(y => y.name).join(' > ');
      resultsType = SEARCH_INTENT_HIT_TYPE_LESSONS;
      break;
    default:
      display = name;
  }

  const props = {
    logo,
    link,
    resultsType,
    description,
    wip,
    err,
    items: cuItems.map(cu => cu && <SearchResultCU cu={cu} hideContent={true} onlyViewsAndDate={true} />),
    parts: total,
    click: searchResultClick(chronicles, dispatch, clickData),
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

  const wipError = WipErr({ wip: wip || items.some(item => !item), err, t });

  return (
    <List.Item className="media_item">
      <List.Content>
        <Container className={clsx('padded', { 'padding_r_l_0': !isMobileDevice })}>
          <Header as="h2">
            <Image size="small" verticalAlign="bottom">{logo}</Image>
            &nbsp;
            <span>{description}</span>
          </Header>
        </Container>
        {wipError}
        {
          !wipError && (<Grid columns="equal" stackable={true}>
            <Grid.Row>
              {items.map(item => <Grid.Column>{item}</Grid.Column>)}
            </Grid.Row>
          </Grid>)
        }
        <Container textAlign={'right'} className="no-border padded" fluid>
          <Icon name="tasks" size="small" style={{ display: 'inline' }} />
          <Link to={link} onClick={() => click(link)}><span>{`${t('search.showAll')} ${parts} ${t(`search.${resultsType}`)}`}</span></Link>
        </Container>
      </List.Content>
    </List.Item>
  );
};

// Reduce series from all leaf tags/sources.
const getLowestLevelSeries = (series, rootId) => {
  if (!series || !series.length) return null;
  const root = series.find(s => s.parent_id === rootId || (!s.parent_id && !rootId));
  if (root && root.children && root.children.length) {
    return root;
  }

  if (!root) return series[series.length - 1];
  return getLowestLevelSeries(series, root.id);
};

const renderSerie = (s, click, link, t) =>
  (
    <Button basic size="tiny" className="link_to_cu" key={s.id}
            as={Link} to={link}
            onClick={() => click(link)}
            style={{ minWidth: '290px', marginBottom: '0.5em', display: 'flex', justifyContent: 'space-between' }}>
      {s.name}
      &nbsp;
      <Link key={s.id} to={link} onClick={() => click(link)}>
        <span className="margin-right-8 margin-left-8">
          <Icon name="tasks" size="small" style={{ display: 'inline-block' }} />
          {`${t('search.showAll')} ${s.cuIDs.length} ${t('pages.collection.items.lessons-collection')}`}
        </span>
      </Link>
    </Button>
  );

export const SearchResultSeries = ({ id, type, mdbUid, clickData }) => {
  const { t }                        = useTranslation();
  const chronicles                   = useContext(ClientChroniclesContext);
  const dispatch                     = useDispatch();
  const nestedDenormCollectionWUnits = useSelector(state => mdb.nestedDenormCollectionWUnits(state.mdb));
  const getSerieBySource             = useSelector(state => lessonsSelectors.getSerieBySourceId(state.lessons, state.mdb, state.sources));
  const getSerieByTag                = useSelector(state => lessonsSelectors.getSerieByTagId(state.lessons, state.mdb, state.tags));
  const filters                      = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));

  const click                            = searchResultClick(chronicles, dispatch, clickData);
  const logo                             = <SectionLogo name={'lessons'} height="50" width="50" />;
  const { lectures: wipL, series: wipS } = useSelector(state => lessonsSelectors.getWip(state.lessons));
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
  collections.unshift(s.collections.find(c => c.id === mdbUid));

  const wipError      = WipErr({ wip: wipL || wipS || collections.some(c => !c), err: null, t });
// If filter used for specific language, make sure the link will redirect to that language.
  const mediaLanguage = getMediaLanguage(filters);

  return (
    <List.Item className="media_item">
      <List.Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Header as="div">
            <Image size="small" verticalAlign="bottom">{logo}</Image>
            &nbsp;
            <span>{t(`constants.content-types.${CT_LESSONS_SERIES}`)}</span>
          </Header>
        </div>
        {wipError}
        {!wipError && (<Grid columns="equal">
          <Grid.Row>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginRight: '1em', paddingTop: '1em' }}>
              {collections.map(c => renderSerie(c, click, canonicalLink(c, mediaLanguage), t))}
            </div>
          </Grid.Row>
        </Grid>)}
      </List.Content>
    </List.Item>
  );
};

const twitterMapFromState = (state, tweets) => tweets.map(tweet => {
  const content = tweet && tweet.highlight && tweet.highlight.content;
  const mdb_uid = tweet && tweet._source && tweet._source.mdb_uid;
  const twitter = publicationSelectors.getTwitter(state.publications, mdb_uid);
  return { twitter, highlight: content };
});

export const SearchResultTweets = ({ source }) => {
  const { t }              = useTranslation();
  const ids                = source.map(x => x._source.mdb_uid) || [];
  const wip                = useSelector(state => publicationSelectors.getTweetsWip(state.publications));
  const err                = useSelector(state => publicationSelectors.getTweetsError(state.publications));
  const wipError           = WipErr({ wip, err, t });
  const items              = useSelector(state => twitterMapFromState(state, source));
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settingsSelectors.getLanguage(state.settings));

  const [pageNo, setPageNo] = useState(0);
  const pageSize            = isMobileDevice ? 1 : 3;

  const dispatch = useDispatch();
  useEffect(() => {
    askForData(0, pageSize);
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

  const isRTL                  = isLanguageRtl(language);
  const swipeHandlers          = useSwipeable({
    onSwipedLeft: isRTL ? onScrollRight : onScrollLeft,
    onSwipedRight: isRTL ? onScrollLeft : onScrollRight
  });
  const renderItem             = ({ twitter, highlight }) => (
    <Card key={twitter.twitter_id} className="bg_hover_grey home-twitter" raised>
      <Card.Content>
        <Feed className="min-height-200">
          <TwitterFeed snippetVersion withDivider={false} twitter={twitter} highlight={highlight && highlight[0]} />
        </Feed>
      </Card.Content>
    </Card>
  );
  const renderScrollPagination = () => {
    const numberOfPages = Math.round(ids.length / pageSize);
    const pages         = new Array(numberOfPages).fill('a');
    const content       = pages.map((p, i) => (
      <Button onClick={() => onScrollChange(i)} key={i} icon className="bg_transparent">
        <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
      </Button>
    ));

    return <Segment basic textAlign="center" className="no-padding">{content}</Segment>;
  };

  const renderScrollRight = () => {
    const dir = isLanguageRtl(language) ? 'right' : 'left';
    return pageNo === 0 ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={onScrollLeft}
        className="scroll_tweets"
        style={{ [dir]: '5px' }}
      />
    );
  };

  const renderScrollLeft = () => {
    const numberOfPages = Math.round(ids.length / pageSize);
    const dir           = isLanguageRtl(language) ? 'left' : 'right';

    return (pageNo >= numberOfPages - 1) ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={onScrollRight}
        className="scroll_tweets"
        style={{ [dir]: '5px' }}
      />
    );
  };

  return (
    <List.Item className="media_item">
      <List.Content horizontal={!isMobileDevice} className="search__block" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Header as="h2" color="blue">{t('home.twitter-title')}</Header>
          <div textAlign={isMobileDevice ? 'left' : 'right'} className="no-padding  no-border">
            <a href={`/${language}/publications/twitter`}>{t('home.all-tweets')}</a>
          </div>
        </div>
        {wipError}
        {!wipError && (
          <div {...swipeHandlers} >
            <Card.Group className={`${isMobileDevice ? 'margin-top-8' : null} search__cards`} itemsPerRow={3} stackable>
              {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).filter(x => x && x.twitter).map(renderItem)}
            </Card.Group>
          </div>
        )}
        {pageSize < ids.length ? renderScrollLeft() : null}
        {pageSize < ids.length ? renderScrollRight() : null}
        {pageSize < ids.length ? renderScrollPagination() : null}
      </List.Content>
    </List.Item>
  );
};

