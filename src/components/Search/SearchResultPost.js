import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

import { CT_BLOG_POST } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultPost extends SearchResultBase {
  render() {
    const { queryResult, hit, rank, filters, post, t } = this.props;

    const { search_result: { searchId } } = queryResult;

    const
      {
        _index: index,
        _source: {
          mdb_uid: mdbUid,
          result_type: resultType,
          title
        },
        highlight
      } = hit;

    let filmDate = '';
    if (post.film_date) {
      filmDate = t('values.date', { date: post.film_date });
    }

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type: 'POST' }, this.getMediaLanguage(filters))}
          >
            {this.titleFromHighlight(highlight, title)}
          </Link>
        </Header>


        <Container>
          {this.iconByContentType(resultType === 'posts' ? CT_BLOG_POST : resultType, true)}
          | <strong>{filmDate}</strong>
        </Container>
        <Container className="content">
          {this.snippetFromHighlight(highlight)}
        </Container>

        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default SearchResultPost;
