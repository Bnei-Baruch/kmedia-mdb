import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Container, Header } from 'semantic-ui-react';

import { CT_BLOG_POST } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultPost extends SearchResultBase {

  render() {
    const { t, queryResult, hit, rank, filters } = this.props;
    const { search_result: { searchId } }        = queryResult;
    const {
            _index: index,
            _source:
              {
                mdb_uid: mdbUid,
                result_type: resultType,
                title
              },
            highlight
          }                                      = hit;

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as='h3'>
          <Link
            className="search__link content"
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type: 'POST' }, this.getMediaLanguage(filters))}>
            {this.titleFromHighlight(highlight, title)}
          </Link>
        </Header>


        <Container>
          {this.iconByContentType(resultType === 'posts' ? CT_BLOG_POST : resultType, true)}
        </Container>
        <Container className="content">
          {this.snippetFromHighlight(highlight)}
        </Container>

        {this.renderDebug(title)}
      </Segment>
    );
  };
}

export default SearchResultPost;
