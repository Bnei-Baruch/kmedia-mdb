import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button, Card, Image, Icon, Segment, Header, List, Container } from 'semantic-ui-react';

import { sectionLogo } from '../../helpers/images';
import { selectors } from '../../redux/modules/mdb';
import { sectionLink, canonicalLink } from '../../helpers/links';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import Link from '../Language/MultiLanguageLink';
import {
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPE_PROGRAMS,
  SEARCH_INTENT_HIT_TYPE_LESSONS,

} from '../../helpers/consts';

import FallbackImage from '../shared/FallbackImage';
import SearchResultBase from './SearchResultBase';

let NUMBER_OF_FETCHED_UNITS = 3 * 4;

class SearchResultIntent extends SearchResultBase {

  static propTypes = {
    ...SearchResultBase.propTypes,
    isMobileDevice: PropTypes.func.isRequired
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };

  componentDidMount() {
    const pageSize          = this.props.isMobileDevice() ? 1 : 3;
    NUMBER_OF_FETCHED_UNITS = pageSize * 4;

    this.askForData(this.props, 0);
    this.setState({ pageSize });
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

  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.unitCounter) {
      return;
    }
    this.setState({ pageNo });
  };

  renderItem = (cu) => {
    const imgParams = Requests.makeParams({ url: assetUrl(`api/thumbnail/${cu.id}`), width: 250 });
    const src       = `${imaginaryUrl('thumbnail')}?${imgParams}`;
    const filmDate  = cu.film_date ? this.props.t('values.date', { date: cu.film_date }) : '';

    return (
      <Card key={cu.id} className="search__card bgHoverGrey" raised>
        <Container className="intentImage">
          <div className='cardHeaderLabel'>
            {this.mlsToStrColon(cu.duration)}
          </div>
          <FallbackImage fluid src={src} />
        </Container>
        <Card.Content>
          <Card.Header>
            <Link
              className="search__link"
              to={canonicalLink(cu)}>
              {cu.name}
            </Link>
          </Card.Header>
          <Card.Meta>
            {this.iconByContentType(cu.content_type, true)}|&nbsp;<strong>{filmDate}</strong>
          </Card.Meta>
          <Card.Description>
            {this.renderFiles(cu)}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  };

  renderScrollPagination = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    const pages   = new Array(numberOfPages).fill('a');
    const content = pages.map((p, i) => {
        return (<Button
          onClick={e => this.onScrollChange(i)} key={i} icon className="bgTransparent">
          <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
        </Button>);
      }
    );

    return <Segment basic textAlign="center" className="padding0">{content}</Segment>;
  };

  renderScrollRight = () => {
    return this.state.pageNo === 0 ? null : (<Button
      icon="chevron left"
      circular
      basic
      size="large"
      onClick={this.onScrollLeft}
      className="scrollIntents"
      style={{ left: '-15px' }}
    />);
  };

  renderScrollLeft = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    return (pageNo >= numberOfPages - 1 ) ? null : (<Button
      icon="chevron right"
      circular
      basic
      size="large"
      onClick={this.onScrollRight}
      className="scrollIntents"
      style={{ right: '-15px' }}
    />);
  };

  render() {
    const { t, queryResult, hit, rank, items }                                           = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid, title }, highlight } = hit;

    const { pageNo, pageSize }            = this.state;
    const { search_result: { searchId } } = queryResult;
    const section                         = SEARCH_INTENT_SECTIONS[type];
    const intentType                      = SEARCH_INTENT_NAMES[index];
    const filterName                      = SEARCH_INTENT_FILTER_NAMES[index];
    const getFilterById                   = this.getFilterById(index);

    let resultsType = '';
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      resultsType = SEARCH_INTENT_HIT_TYPE_PROGRAMS;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      resultsType = SEARCH_INTENT_HIT_TYPE_LESSONS;
      break;
    }

    return (
      <Segment className="search__block">
        <Header as="h2">
          <Image size="small" src={sectionLogo[type]} verticalAlign='bottom' />&nbsp;
          <span>{t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)}</span>
        </Header>
        <List verticalAlign='middle'>
          <List.Item>
            <List.Content floated='right'>
              <Icon name="tasks" size="small" />
              <Link
                onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}>
                <span>{`${t('search.showAll')} ${this.props.total} ${t('search.' + resultsType)}`}</span>
              </Link>
            </List.Content>
            <Header as="h3" color="blue">
              <Link
                className="search__link"
                onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}>
                {this.titleFromHighlight(highlight, title)}
              </Link>
            </Header>
          </List.Item>
        </List>
        <Card.Group className="search__cards" itemsPerRow={3} stackable>
          {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map(this.renderItem)}
          {this.renderScrollLeft()}
          {this.renderScrollRight()}
        </Card.Group>
        {this.renderScrollPagination()}
      </Segment>
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
  };
};

const mapDispatch = dispatch => bindActionCreators({ fetchIntents: listsActions.fetchIntents }, dispatch);

export default connect(mapState, mapDispatch)(SearchResultIntent);
