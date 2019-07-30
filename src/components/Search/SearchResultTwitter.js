import React from 'react';
import { connect } from 'react-redux';
import { Segment, Image, Container, Header } from 'semantic-ui-react';

import { LANG_HEBREW, LANG_UKRAINIAN, LANG_RUSSIAN, LANG_SPANISH } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultTwitter extends SearchResultBase {

  getTwitterLink = (language, tID) => {

    let username;
    switch (language) {
    case LANG_HEBREW:
      username = 'laitman_co_il';
    case LANG_UKRAINIAN:
    case LANG_RUSSIAN:
      username = 'Michael_Laitman';
    case LANG_SPANISH:
      username = 'laitman_es';
    default:
      username = 'laitman';
    }
    return tID ? `https://twitter.com/${username}/status/${tID}` : `https://twitter.com/${username}`;
  };

  render() {

    const { queryResult, twitt, hit, rank, filters } = this.props;

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


    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            to={this.getTwitterLink(this.getMediaLanguage(filters), mdbUid)}
          >
            {this.titleFromHighlight(highlight, twitt.name)}
          </Link>
        </Header>

        <Container className="content">
          {this.renderSnippet(highlight)}
        </Container>

        {this.renderDebug(twitt.name)}
      </Segment>
    );
  }
}

export default SearchResultTwitter;
