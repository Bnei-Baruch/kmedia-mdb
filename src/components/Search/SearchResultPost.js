import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Container, Header } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultPost extends SearchResultBase {

  renderSnippet = (highlight) => {
    return (<div className="search__snippet">
      {this.snippetFromHighlight(highlight)}
    </div>);
  };

  render() {
    const { t, queryResult, hit, rank }   = this.props;
    const { search_result: { searchId } } = queryResult;
    const {
            _index: index,
            _source:
              {
                mdb_uid: mdbUid,
                result_type: resultType
              },
            highlight,
            _type: type
          }                               = hit;

    return (
      <Segment className="bgHoverGrey search__block">
        <Header as='h3'>
          <Link
            className="search__link content"
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type: 'POST' })}>
            {this.titleFromHighlight(highlight, '')}
          </Link>
        </Header>


        <Container className="content">
          {this.renderSnippet(highlight)}
        </Container>
      </Segment>
    );
  };
}

export default SearchResultPost;
