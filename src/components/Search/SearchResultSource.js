import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';
import { stringify as urlSearchStringify } from '../../helpers/url';

class SearchResultSource extends SearchResultBase {

  buildLinkParams = () => {
    const { queryResult: { search_result: { searchId } }, hit, rank, searchLanguage: language } = this.props;
    const { _index: index, _source: { mdb_uid: id, result_type: resultType }, }                 = hit;

    return {
      canonicalLinkParams: [{ id, content_type: 'SOURCE' }],
      canonicalLinkSearch: { language },
      logLinkParams: [id, index, resultType, rank, searchId]
    };
  };

  render() {
    const { t, hit: { _source: { title }, highlight } } = this.props;

    const name                                                        = this.titleFromHighlight(highlight, title);
    const { canonicalLinkParams, logLinkParams, canonicalLinkSearch } = this.buildLinkParams();

    return (
      <Segment verticalalign="top" className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link"
            onClick={() => this.logClick(...logLinkParams)}
            to={{
              pathname: canonicalLink(...canonicalLinkParams),
              search: urlSearchStringify(canonicalLinkSearch)
            }}
          >
            {name}
          </Link>
        </Header>
        <Container>
          {this.iconByContentType('sources', t)}
        </Container>
        <Container className="content">
          {this.snippetFromHighlightWithLink(highlight)}
        </Container>
        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default connect(state => ({
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
}))(SearchResultSource);
