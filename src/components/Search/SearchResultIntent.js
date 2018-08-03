import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Icon, Button, Image, Segment, Pagination } from 'semantic-ui-react';

import withPagination from '../Pagination/withPagination';
import { selectors as settings } from '../../redux/modules/settings';
import { actions, selectors } from '../../redux/modules/mdb';
import { canonicalLink, sectionLink } from '../../helpers/links';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { formatDuration, isEmpty, tracePath } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WipErr from '../shared/WipErr/WipErr';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import ScoreDebug from './ScoreDebug';
import SearchResultCU from './SearchResultCU';
import {
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPES,
  CT_VIDEO_PROGRAM_CHAPTER,
} from '../../helpers/consts';

class SearchResultIntent extends withPagination {
  static propTypes = {
    results: PropTypes.object,
    getSourcePath: PropTypes.func,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
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

  componentDidMount() {
    this.askForData(this.props, 0);
  }


    componentWillReceiveProps(nextProps) {
      // clear all filters when location's search is cleared by Menu click
      if (nextProps.location.search !== this.props.location.search &&
        !nextProps.location.search) {
        nextProps.resetNamespace(nextProps.namespace);

        this.setPage(this.props, 0);
      }

      super.componentWillReceiveProps(nextProps);
    }

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, type, rank, searchId);
  };

  extraFetchParams = () => ({ content_type: [CT_VIDEO_PROGRAM_CHAPTER] });

  renderItem = (cu) => {

    let src = assetUrl(`api/thumbnail/${cu.id}`);
    if (!src.startsWith('http')) {
      src = `http://localhost${src}`;
    }
    src = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: src, width: 250 })}`;

    const filmDate = cu.film_date ? this.props.t('values.date', { date: cu.film_date }) : '';

    return (
      <Segment key={cu.id}>
        <Image src={src} />
        <Divider hidden />
        <Link className="search__link" to={src}>{cu.name}</Link>

        <div>{filmDate}</div>
      </Segment>
    );
  };

  renderScroll = () => {
    const pages     = new Array(this.props.numberOfPages).fill('a');
    const pagesHtml = pages.map((p, i) => (
      <Button style={{ padding: '10px' }} onClick={e => this.onScrollChange(i)}>o</Button>));
    return (<div style={{ textAlign: 'center' }}>{pagesHtml}</div>);
  };

  onScrollChange = (page) => {
    this.askForData(this.props, page);
  };

  render() {
    const { t, pageNo, queryResult, getTagById, getSourceById, hit, rank, numberOfPages, items } = this.props;
    const { search_result: { searchId } }                                                        = queryResult;
    const {
            _index: index,
            _type: type,
            _source: {
              content_type: contentType,
              mdb_uid: mdbUid,
              name,
              explanation,
              score: originalScore,
              max_explanation: maxExplanation,
              max_score: maxScore
            },
            _score: score,
          }                                                                                      = hit;
    const section                                                                                = SEARCH_INTENT_SECTIONS[type];
    const intentType                                                                             = SEARCH_INTENT_NAMES[index];
    const filterName                                                                             = SEARCH_INTENT_FILTER_NAMES[index];

    let getFilterById = null;
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      getFilterById = getTagById;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      getFilterById = getSourceById;
      break;
    default:
      console.log('Using default filter:', index);
      getFilterById = x => x;
    }

    const path  = tracePath(getFilterById(mdbUid), getFilterById);
    let display = '';
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      display = path[path.length - 1].label;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      display = path.map(y => y.name).join(' > ');
      break;
    default:
      display = name;
    }

    const scrollRight = pageNo === 1 ? null : (<Button
      icon="chevron left"
      circular
      basic
      size="large"
      onClick={this.scrollLeft}
      style={{ position: 'absolute', top: '100px', left: 0 }}
    />);

    const scrollLeft = (pageNo === numberOfPages) ? null : (<Button
      icon="chevron right"
      circular
      basic
      size="large"
      onClick={this.scrollRight}
      style={{ position: 'absolute', top: '100px', right: 0 }}
    />);

    return (
      <Segment>
        <Link
          className="search__link"
          onClick={() => this.click(mdbUid, index, type, rank, searchId)}
          to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}
        >
          {t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)} {display}


          <span style={{ float: 'right' }}>
            {`${t('search.showAll')} ${this.props.total} ${t('search.lessons')}`}
          </span>

        </Link>
        <Segment.Group horizontal>
          {items.map(this.renderItem)}
        </Segment.Group>
        {this.renderScroll()}
        {scrollRight}
        {scrollLeft}
      </Segment>

    );
  }
}

const mapState = (state, ownProps) => {
  const namespace = 'programs';
  const nsState   = lists.getNamespaceState(state.lists, namespace);
  return {
    namespace,
    items: (nsState.items || []).map(x => selectors.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    pageNo: nsState.pageNo,
    total: nsState.total,
    pageSize: 3,
    numberOfPages: 4,
    language: settings.getLanguage(state.settings),

    filters: filterSelectors.getFilters(state.filters, 'search'),
    areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
    getSourcePath: sourcesSelectors.getPathByID(state.sources),
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchList: listsActions.fetchList,
  setPage: listsActions.setPage,
}, dispatch);

export default connect(mapState, mapDispatch)(translate()(SearchResultIntent));
