import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import { CT_BLOG_POST } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultPost extends SearchResultBase {
  render() {
    const { hit, post, t }                                           = this.props;
    const { _source: { result_type: resultType, title }, highlight } = hit;

    const createdDate                            = post.created_at ? t('values.date', { date: post.created_at }) : '';
    const { canonicalLinkParams, logLinkParams } = this.buildLinkParams();

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.logClick(...logLinkParams)}
            to={canonicalLink(...canonicalLinkParams)}
          >
            {this.titleFromHighlight(highlight, title)}
          </Link>
        </Header>

        <Container>
          {this.iconByContentType(resultType === 'posts' ? CT_BLOG_POST : resultType, t)}
          |
          {' '}
          <strong>{createdDate}</strong>
        </Container>
        <Container className="content">{this.snippetFromHighlight(highlight)}</Container>

        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default SearchResultPost;
