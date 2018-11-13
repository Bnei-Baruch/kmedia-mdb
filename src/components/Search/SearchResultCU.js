import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultCU extends SearchResultBase {
  renderSnippet = (highlight) => {
    const content     = this.snippetFromHighlight(highlight);
    const description = this.snippetFromHighlight(highlight, ['description', 'description_language']);

    return (
      <div className="search__snippet">
        {
          description ?
            <div>
              <strong>{this.props.t('search.result.description')}: </strong>
              {description}
            </div> :
            null
        }
        {
          content ?
            <div>
              <strong>{this.props.t('search.result.transcript')}: </strong>
              {content}
            </div> :
            null
        }
      </div>);
  };

  render() {
    const { t, queryResult, cu, hit, rank, filters } = this.props;

    const { search_result: { searchId } } = queryResult;

    const
      {
        _index: index,
        _source: {
          mdb_uid: mdbUid,
          result_type: resultType
        },
        highlight,
      } = hit;

    let filmDate = '';
    if (cu.film_date) {
      filmDate = t('values.date', { date: cu.film_date });
    }

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type }, this.getMediaLanguage(filters))}
          >
            {this.titleFromHighlight(highlight, cu.name)}
          </Link>
        </Header>

        <Container>
          {this.iconByContentType(cu.content_type, true)} | <strong>{filmDate}</strong>
          <div className="clear" />
        </Container>

        <Container className="content">
          {this.renderSnippet(highlight)}
        </Container>
        <Container>
          {this.renderFiles(cu)}
          <div className="clear" />
        </Container>

        {this.renderDebug(cu.name)}
      </Segment>
    );
  }
}

export default SearchResultCU;
