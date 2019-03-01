import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { Button, Card, Image, Icon, Segment, Header } from 'semantic-ui-react';
import { selectors } from '../../redux/modules/mdb';

import { sectionLogo } from '../../helpers/images';
import { tracePath } from '../../helpers/utils';
import { sectionLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import {
  RTL_LANGUAGES,
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPE_PROGRAMS,
  SEARCH_INTENT_HIT_TYPE_LESSONS,

} from '../../helpers/consts';

import SearchResultBase from './SearchResultBase';

let NUMBER_OF_FETCHED_UNITS = 3 * 4;



class SearchResultTwitter extends SearchResultBase {

  static propTypes = {
    ...SearchResultBase.propTypes,
    isMobileDevice: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };
  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.unitCounter) {
      return;
    }
    this.setState({ pageNo });
  };


  // eslint-disable-next-line react/no-multi-comp
  renderScrollPagination = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    const pages   = new Array(numberOfPages).fill('a');
    const content = pages.map((p, i) => (
      <Button onClick={e => this.onScrollChange(i)} key={i} icon className="bg_transparent">
        <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
      </Button>
    ));

    return <Segment basic textAlign="center" className="no-padding">{content}</Segment>;
  };

  // eslint-disable-next-line react/no-multi-comp
  renderScrollRight = () => {
    const dir = RTL_LANGUAGES.includes(this.props.language) ? 'right' : 'left';
    return this.state.pageNo === 0 ? null : (<Button
      icon={`chevron ${dir}`}
      circular
      basic
      size="large"
      onClick={this.onScrollLeft}
      className="scroll_intents"
      style={{ [dir]: '-15px' }}
    />);
  };

  // eslint-disable-next-line react/no-multi-comp
  renderScrollLeft = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);
    const dir                  = RTL_LANGUAGES.includes(this.props.language) ? 'left' : 'right';

    return (pageNo >= numberOfPages - 1) ? null : (<Button
      icon={`chevron ${dir}`}
      circular
      basic
      size="large"
      onClick={this.onScrollRight}
      className="scroll_intents"
      style={{ [dir]: '-15px' }}
    />);
  };


  render() {
    const { t, queryResult, hit, rank, items, unitCounter, isMobileDevice }             = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid, name }, highlight } = hit;

    const { pageNo, pageSize }            = this.state;
    const { search_result: { searchId } } = queryResult;
    const section                         = SEARCH_INTENT_SECTIONS[type];
    const intentType                      = SEARCH_INTENT_NAMES[index];
    const filterName                      = SEARCH_INTENT_FILTER_NAMES[index];
    const getFilterById                   = this.getFilterById(index);

    let resultsType = '';
    const path      = tracePath(getFilterById(mdbUid), getFilterById);
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

    return (
      <Segment className="search__block">
        <Header as="h2">
          <Image size="small" src={sectionLogo[type]} verticalAlign="bottom" />&nbsp;
          <span>{t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)}</span>
        </Header>
        <Segment.Group horizontal={!isMobileDevice()} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">
              <Link
                className="search__link"
                onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}
              >
                {this.titleFromHighlight(highlight, display)}
              </Link>
            </Header>
          </Segment>
          <Segment textAlign={isMobileDevice() ? 'left' : 'right'} className="no-padding  no-border">
            <Icon name="tasks" size="small" />
            <Link
              onClick={() => this.click(mdbUid, index, type, rank, searchId)}
              to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}
            >
              <span>{`${t('search.showAll')} ${this.props.total} ${t('search.' + resultsType)}`}</span>
            </Link>
          </Segment>
        </Segment.Group>
        <div className="clear" />
        <Card.Group className={`${isMobileDevice() ? 'margin-top-8' : null} search__cards`} itemsPerRow={3} stackable>
          {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map(this.renderItem)}
          {pageSize < unitCounter ? this.renderScrollLeft() : null}
          {pageSize < unitCounter ? this.renderScrollRight() : null}
        </Card.Group>
        {pageSize < unitCounter ? this.renderScrollPagination() : null}

        {this.renderDebug(display)}
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

const mapDispatch = dispatch => bindActionCreators({ fetchList: listsActions.fetchList }, dispatch);

export default connect(mapState, mapDispatch)(SearchResultTwitter);

