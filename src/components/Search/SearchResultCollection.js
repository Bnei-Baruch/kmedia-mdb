import React from 'react';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import { assetUrl } from '../../helpers/Api';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import FallbackImage from '../shared/FallbackImage';
import SearchResultBase from './SearchResultBase';

class SearchResultCollection extends SearchResultBase {
  static propTypes = {
    ...SearchResultBase.props,
    c: shapes.Collection,
  };

  state = { isImgLoaded: false };

  renderCU = cu => {
    const { queryResult, hit, rank }                                   = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid } } = hit;
    const { search_result: { searchId } }                              = queryResult;

    return (
      <Link
        key={cu.id}
        onClick={() => this.logClick(mdbUid, index, type, rank, searchId)}
        to={canonicalLink(cu, this.getMediaLanguage(this.props.filters))}>
        <Button basic size="tiny" className="link_to_cu">
          {cu.name}
        </Button>
      </Link>
    );
  };

  handleImageContextRef = (ref) => {
    if (ref) {
      this.imgRef = ref.children[0];
    }
  };

  imgLoadHandler  = () => {
    this.setState({ isImgLoaded: true });
  };
  buildLinkParams = () => {
    const { queryResult: { search_result: { searchId } }, hit, rank, filters, c }   = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, } = hit;

    return {
      canonicalLinkParams: [c || { id: mdbUid, content_type: c.content_type }, this.getMediaLanguage(filters)],
      canonicalLinkSearch: {},
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
  };

  render() {
    const { t, location, c, hit }                = this.props;
    const { highlight, _score: score }           = hit;
    const { isImgLoaded }                        = this.state;
    const { canonicalLinkParams, logLinkParams } = this.buildLinkParams();

    return (
      <Segment className="bg_hover_grey search__block">
        <Container>
          <span ref={this.handleImageContextRef}>
            <FallbackImage
              circular
              width={isImgLoaded ? this.imgRef.offsetWidth.toString() : null}
              height={isImgLoaded ? this.imgRef.offsetWidth.toString() : null}
              onLoad={this.imgLoadHandler}
              floated="left"
              fallbackImage={null}
              size="tiny"
              src={assetUrl(`logos/collections/${this.props.c.id}.jpg`)}
            />
          </span>
          <Container>
            <Container as="h3">
              <Link
                className="search__link"
                onClick={() => this.logClick(...logLinkParams)}
                to={canonicalLink(...canonicalLinkParams)}
              >
                {this.titleFromHighlight(highlight, c.name)}
              </Link>
            </Container>

            <Container className="content">
              {this.iconByContentType(c.content_type, t)}
              |
              <span>
                {c.content_units.length}
                {' '}
                {t('pages.collection.items.programs-collection')}
              </span>
            </Container>
            <div className="clear" />
          </Container>

          <Container className="content clear margin-top-8">
            {c.content_units.slice(0, 5).map(this.renderCU)}

            <Link
              onClick={() => this.logClick(...logLinkParams)}
              to={canonicalLink(...canonicalLinkParams)}
              className="margin-right-8"
            >
              <Icon name="tasks" size="small" />
              {`${t('search.showAll')} ${c.content_units.length} ${t('pages.collection.items.programs-collection')}`}
            </Link>
          </Container>
        </Container>
        {
          !isDebMode(location)
            ? null
            : (
              <Container collapsing>
                <ScoreDebug name={c.name} score={score} explanation={hit._explanation} />
              </Container>
            )
        }
      </Segment>
    );
  }
}

export default SearchResultCollection;
