import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import * as renderUnitHelper from '../../helpers/renderUnitHelper';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';
import * as shapes from '../shapes';

class SearchResultCU extends SearchResultBase {
  static propTypes = {
    cu: shapes.ContentUnit,
  };

  renderSnippet = (highlight) => {
    const content     = this.snippetFromHighlightWithLink(highlight);
    const description = this.snippetFromHighlight(highlight, ['description', 'description_language']);

    return (
      <div className="search__snippet">
        {
          description
            ? (
              <div>
                <strong>
                  {this.props.t('search.result.description')}
                  :
                  {' '}
                </strong>
                {description}
              </div>
            )
            : null
        }
        {
          content
            ? (
              <div>
                <strong>
                  {this.props.t('search.result.transcript')}
                  :
                  {' '}
                </strong>
                {content}
              </div>
            )
            : null
        }
      </div>
    );
  };

  buildLinkParams = () => {
    const { queryResult: { search_result: { searchId } }, cu, hit, rank, filters, searchLanguage: language } = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, }                          = hit;

    return {
      canonicalLinkParams: [cu || { id: mdbUid, content_type: cu.content_type }, this.getMediaLanguage(filters)],
      canonicalLinkSearch: { activeTab: 'transcription', language },
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
  };

  render() {
    const { t, queryResult: { search_result: { searchId } }, cu, hit, rank }                   = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, highlight, } = hit;
    const { canonicalLinkParams, logLinkParams }                                               = this.buildLinkParams();

    const filmDate = renderUnitHelper.getFilmDate(cu, t);

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.logClick(...logLinkParams)}
            to={canonicalLink(...canonicalLinkParams)}
          >
            {this.titleFromHighlight(highlight, cu.name)}
          </Link>
          {this.fileDuration(cu.files)}
        </Header>

        <Container>
          {this.iconByContentType(cu.content_type, t)}
          |
          {' '}
          <strong>{filmDate}</strong>
          <div className="clear" />
        </Container>

        <Container className="content">{this.renderSnippet(highlight)}</Container>

        <Container>
          {this.renderFiles(cu, mdbUid, index, resultType, rank, searchId)}
          <div className="clear" />
        </Container>

        {this.renderDebug(cu.name)}
      </Segment>
    );
  }
}

export default SearchResultCU;
