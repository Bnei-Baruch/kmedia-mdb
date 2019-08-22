import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icon, Segment, Feed } from 'semantic-ui-react';
import { Swipeable } from 'react-swipeable';

import { isLanguageRtl } from '../../helpers/i18n-utils';
import { selectors as publicationSelectors } from '../../redux/modules/publications';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import TwitterFeed from '../Sections/Publications/tabs/Twitter/Feed';
import { SEARCH_INTENT_INDEX_SOURCE, SEARCH_INTENT_INDEX_TOPIC } from '../../helpers/consts';

import SearchResultBase from './SearchResultBase';

let NUMBER_OF_FETCHED_UNITS = 3 * 4;

class SearchResultTwitters extends SearchResultBase {
  static propTypes = {
    ...SearchResultBase.propTypes,
    isMobileDevice: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };

  // TODO: revisit the NUMBER_OF_FETCHED_UNITS implementation
  // initialize on componentWillMount or constructor
  // note that it is used also in redux connect (mapState)
  componentDidMount() {
    const pageSize          = this.props.isMobileDevice() ? 1 : 3;
    NUMBER_OF_FETCHED_UNITS = pageSize * 4;

    this.askForData(1);
    this.setState({ pageSize });
  }

  askForData = (page) => {
    const { fetchList } = this.props;

    const namespace = 'tweets';
    const params    = {
      content_type: 'tweet',
      page_size: NUMBER_OF_FETCHED_UNITS
    };
    fetchList(namespace, page, params);
  };

  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.unitCounter) {
      return;
    }
    this.setState({ pageNo });
  };

  getSwipeProps = () => {
    const isRTL = isLanguageRtl(this.props.language);
    return {
      onSwipedLeft: isRTL ? this.onScrollRight : this.onScrollLeft,
      onSwipedRight: isRTL ? this.onScrollLeft : this.onScrollRight
    };
  };

  renderItem = ({ twitter, highlight }) => {
    return (
      <Card key={twitter.twitter_id} className="search__card bg_hover_grey home-twitter" raised>
        <Card.Content>
          <Feed className="min-height-200">
            <TwitterFeed snippetVersion withDivider={false} twitter={twitter} highlight={highlight} />
          </Feed>
        </Card.Content>
      </Card>
    );
  };

  renderScrollPagination = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    const pages   = new Array(numberOfPages).fill('a');
    const content = pages.map((p, i) => (
      <Button onClick={() => this.onScrollChange(i)} key={i} icon className="bg_transparent">
        <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
      </Button>
    ));

    return <Segment basic textAlign="center" className="no-padding">{content}</Segment>;
  };

  renderScrollRight = () => {
    const dir = isLanguageRtl(this.props.language) ? 'right' : 'left';
    return this.state.pageNo === 0 ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={this.onScrollLeft}
        className="scroll_intents"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  renderScrollLeft = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);
    const dir                  = isLanguageRtl(this.props.language) ? 'left' : 'right';

    return (pageNo >= numberOfPages - 1) ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={this.onScrollRight}
        className="scroll_intents"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  render() {
    const { t, items, unitCounter, isMobileDevice, language } = this.props;
    const { pageNo, pageSize }                                = this.state;

    return (
      <Segment className="search__block no-border">
        <Segment.Group horizontal={!isMobileDevice()} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">{t('home.twitter-title')}</Header>
          </Segment>
          <Segment textAlign={isMobileDevice() ? 'left' : 'right'} className="no-padding  no-border">
            <a href={`/${language}/publications/twitter`}>{t('home.all-tweets')}</a>
          </Segment>
        </Segment.Group>
        <div className="clear" />
        <Swipeable {...this.getSwipeProps()} >
          <Card.Group className={`${isMobileDevice() ? 'margin-top-8' : null} search__cards`} itemsPerRow={3} stackable>
            {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map(this.renderItem)}
            {pageSize < unitCounter ? this.renderScrollLeft() : null}
            {pageSize < unitCounter ? this.renderScrollRight() : null}
          </Card.Group>
        </Swipeable>
        {pageSize < unitCounter ? this.renderScrollPagination() : null}
      </Segment>
    );
  }
}

const twitterMapFromState = (state, tweets) => {
  return tweets.map(({ highlight: { content }, _source: { mdb_uid } }) => {
    const twitter = publicationSelectors.getTwitter(state.publications, mdb_uid);
    return { twitter, highlight: content };
  });
};

const mapState = (state, ownProps) => {
  const { hit: { _source } } = ownProps;

  const namespace   = `twitters`;
  const nsState     = lists.getNamespaceState(state.lists, namespace);
  const unitCounter = (nsState.total > 0 && nsState.total < NUMBER_OF_FETCHED_UNITS) ? nsState.total : NUMBER_OF_FETCHED_UNITS;

  return {
    namespace,
    unitCounter,
    items: twitterMapFromState(state, _source),
    wip: nsState.wip,
    err: nsState.err,
    total: nsState.total,
  };
};

const mapDispatch = dispatch => bindActionCreators({ fetchList: listsActions.fetchList }, dispatch);

export default connect(mapState, mapDispatch)(SearchResultTwitters);
