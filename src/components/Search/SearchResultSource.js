import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Image, Segment } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { SectionLogo } from '../../helpers/images';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultSource extends SearchResultBase {

  buildLinkParams = () => {
    const { queryResult: { search_result: { searchId } }, hit, rank } = this.props;
    const
      {
        _index: index,
        _source: {
          mdb_uid: mdbUid,
          result_type: resultType
        },
      }                                                               = hit;

    return {
      canonicalLinkParams: [{ id: mdbUid, content_type: 'SOURCE' }],
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
  };

  render() {
    const { t, hit, filters } = this.props;

    const
      {
        _source: {
          title
        },
        highlight
      } = hit;

    const name                                   = this.titleFromHighlight(highlight, title);
    const { canonicalLinkParams, logLinkParams } = this.buildLinkParams();

    return (
      <Segment verticalalign="top" className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link"
            onClick={() => this.logClick(...logLinkParams)}
            to={canonicalLink(...canonicalLinkParams)}
            language={this.getMediaLanguage(filters)}
          >
            {name}
          </Link>
        </Header>
        <Container>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' height='50' width='50' />
          </Image>

          &nbsp;&nbsp;
          <span>{t('filters.sections-filter.sources')}</span>
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
