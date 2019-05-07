import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Segment } from 'semantic-ui-react';

import Link from '../Language/MultiLanguageLink';
import { landingPageSectionLink } from '../../helpers/links';

import SearchResultBase from './SearchResultBase';

import {
    SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT,
    SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT,
} from '../../helpers/consts'

class SearchResultLandingPage extends SearchResultBase {
  static propTypes = {
    ...SearchResultBase.propTypes,
    isMobileDevice: PropTypes.func.isRequired,
  };

  render() {
    const { hit, isMobileDevice, t } = this.props;
    const { _source: { landing_page: landingPage }} = hit;
    const linkTitle = SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT[landingPage] || 'home.sections';
    const subText = SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT[landingPage]

    return (
      <Segment className="search__block">
        <Segment.Group horizontal={!isMobileDevice()} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">
              <Link
                className="search__link"
                to={landingPageSectionLink(landingPage)}
              >
                {t(linkTitle)}
              </Link>
            </Header>
            {!subText ? null : <Container className="content">
              {t(subText)}
            </Container>}
          </Segment>
        </Segment.Group>

        {this.renderDebug('')}
      </Segment>
    );
  }
}

export default SearchResultLandingPage;
