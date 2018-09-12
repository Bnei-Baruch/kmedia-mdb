import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Button, Card, Image, Icon } from 'semantic-ui-react';

import { sectionLogo } from '../../helpers/images';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors } from '../../redux/modules/mdb';
import { sectionLink, canonicalLink } from '../../helpers/links';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { tracePath } from '../../helpers/utils';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import {
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPE_PROGRAMS,
  SEARCH_INTENT_HIT_TYPE_LESSONS,
  MT_TEXT, MT_AUDIO, MT_VIDEO, MT_IMAGE, CT_LESSON_PART

} from '../../helpers/consts';

let NUMBER_OF_FETCHED_UNITS = 3 * 4;

class SearchResultIntent extends Component {
  static propTypes = {
    results: PropTypes.object,
    getSourcePath: PropTypes.func,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
  };

  static defaultProps = {
    queryResult: null,
    cMap: {},
    cuMap: {},
    wip: false,
    err: null,
    getSourcePath: undefined,
    intents: [],
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };

  componentDidMount() {
    this.askForData(this.props, 0);
  }

  askForData = () => {
    const { fetchIntents, hit: { _index, _source: { content_type: contentType, mdb_uid: mdbUid, } } } = this.props;

    if (!['topics-filter', 'sources-filter'].includes(SEARCH_INTENT_FILTER_NAMES[_index])) {
      return;
    }

    const namespace = `intents_${mdbUid}_${contentType}`;
    const params    = {
      content_type: contentType,
      page_no: 1,
      page_size: NUMBER_OF_FETCHED_UNITS,
      [this.parentTypeByIndex(_index)]: mdbUid
    };
    fetchIntents(namespace, params);
  };

  parentTypeByIndex = (index) => {
    switch (index) {
    case SEARCH_INTENT_INDEX_SOURCE:
      return 'source';
    case SEARCH_INTENT_INDEX_TOPIC:
      return 'tag';
    default:
      return 'tag';
    }
  };

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, type, rank, searchId);
  };

  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.unitCounter) {
      return;
    }
    this.setState({ pageNo });
  };

  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  renderItem = (cu) => {
    let src = assetUrl(`api/thumbnail/${cu.id}`);
    if (!src.startsWith('http')) {
      src = `http://localhost${src}`;
    }
    src = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: src, width: 250 })}`;

    const filmDate = cu.film_date ? this.props.t('values.date', { date: cu.film_date }) : '';

    return (
      <Card key={cu.id} className="search__card" href={canonicalLink(cu)} link>
        <div className="cardHeader">
          <div className='cardHeaderLabel'>
            {this.mlsToStrColon(cu.duration)}
            <Icon name="play" size="small" />
          </div>
          <Image src={src} fluid />
        </div>
        <Card.Content>
          <Card.Header className="search__link">
            {cu.name}
          </Card.Header>
          <Card.Meta>
            {this.iconByContentType(cu.content_type)}
            <strong>{filmDate}</strong>
          </Card.Meta>
          <Card.Description>
            {this.renderFiles(cu)}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  };

  renderFiles = (cu) => {
    const { t }          = this.props;
    const { files = [] } = cu;
    const pathname       = canonicalLink(cu);
    const types          = [
      {
        type: MT_VIDEO,
        icon: 'video',
        title: t('constants.media-types.video'),
        to: { search: 'mediaType=video' }
      },
      {
        type: MT_AUDIO,
        icon: 'audio',
        title: t('constants.media-types.audio'),
        to: { search: 'mediaType=audio' }
      },
      {
        type: MT_TEXT,
        icon: 'text',
        title: t('materials.transcription.header'),
        to: { state: { active: 'transcription' } }
      },
      { type: MT_IMAGE, icon: 'image', title: t('materials.sketches.header'), to: { state: { active: 'sketches' } } },
    ];

    return types
      .filter(x => files.some(f => f.type === x.type))
      .map(x => this.renderFile(x, pathname));
  };

  renderFile = (data, pathname) => {
    const to = { pathname, ...data.to };

    return (
      <Link to={to} key={data.type}>
        <Button floated='left' size="mini">
          <Icon name={'file ' + data.icon} /> {data.title}
        </Button>
      </Link>
    );
  };

  iconByContentType = (type) => {
    let icon;
    switch (type) {
    case CT_LESSON_PART:
      icon = 'lessons';
      break;
    default:
      icon = 'programs';
      break;
    }
    return <Image src={sectionLogo[icon]} />;
  };

  renderScroll = () => {

    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    const scrollRight = pageNo === 0 ? null : (<Button
      icon="chevron left"
      circular
      basic
      size="large"
      onClick={this.onScrollLeft}
      style={{ position: 'absolute', top: '100px', left: 0 }}
    />);

    const scrollLeft = (pageNo >= numberOfPages - 1 ) ? null : (<Button
      icon="chevron right"
      circular
      basic
      size="large"
      onClick={this.onScrollRight}
      style={{ position: 'absolute', top: '100px', right: 0 }}
    />);

    const pages     = new Array(numberOfPages).fill('a');
    const pagesHtml = pages.map((p, i) => {
        return (<Button
          onClick={e => this.onScrollChange(i)} key={i} icon className="bgTransparent">
          <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
        </Button>);
      }
    );

    return (
      <div>
        {scrollRight}
        {scrollLeft}
        <div style={{ textAlign: 'center' }}>
          {pagesHtml}
        </div>
      </div>
    );
  };

  getFilterById = index => {
    const { getTagById, getSourceById } = this.props;
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      return getTagById;
    case SEARCH_INTENT_INDEX_SOURCE:
      return getSourceById;
    default:
      console.log('Using default filter:', index);
      return x => x;
    }
  };

  iconByContentType = (type) => {
    let icon;
    switch (type) {
    case CT_LESSON_PART:
      icon = SEARCH_INTENT_HIT_TYPE_LESSONS;
      break;
    default:
      icon = SEARCH_INTENT_HIT_TYPE_PROGRAMS;
      break;
    }
    return <Image src={sectionLogo[icon]} />;
  };

  render() {
    const { t, queryResult, hit, rank, items }                               = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid, name } } = hit;

    const { pageNo, pageSize }            = this.state;
    const { search_result: { searchId } } = queryResult;
    const section                         = SEARCH_INTENT_SECTIONS[type];
    const intentType                      = SEARCH_INTENT_NAMES[index];
    const filterName                      = SEARCH_INTENT_FILTER_NAMES[index];
    const getFilterById                   = this.getFilterById(index);

    const path      = tracePath(getFilterById(mdbUid), getFilterById);
    let display     = '';
    let resultsType = '';
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

    return (
      <div style={{ position: 'relative' }}>
        <Link
          className="search__link"
          onClick={() => this.click(mdbUid, index, type, rank, searchId)}
          to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}>
          <h3>{t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)}</h3>
          {display}
          <span style={{ float: 'right' }}>
            <Icon name="list" size="small" />
            {`${t('search.showAll')} ${this.props.total} ${t('search.' + resultsType)}`}
          </span>

        </Link>
        <Card.Group>
          {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map(this.renderItem)}
        </Card.Group>
        {this.renderScroll()}
      </div>
    );
  }
}

const mapState = (state, ownProps) => {

  const { hit: { _source: { content_type: contentType, mdb_uid: mdbUid, } } } = ownProps;

  const namespace   = `intents_${mdbUid}_${contentType}`;
  const nsState     = lists.getNamespaceState(state.lists, namespace);
  const unitCounter = (nsState.total > 0 && nsState.total < NUMBER_OF_FETCHED_UNITS) ? nsState.total : NUMBER_OF_FETCHED_UNITS;

  return {
    namespace,
    unitCounter,
    items: (nsState.items || []).map(x => selectors.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    total: nsState.total,
    language: settings.getLanguage(state.settings),

    areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
    getSourcePath: sourcesSelectors.getPathByID(state.sources),
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
  };
};

const mapDispatch = dispatch => bindActionCreators({ fetchIntents: listsActions.fetchIntents }, dispatch);

export default connect(mapState, mapDispatch)(translate()(SearchResultIntent));
