import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Image, Container, Header } from 'semantic-ui-react';
import { canonicalLink } from '../../helpers/links';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultSource extends SearchResultBase {

  render() {
    const { t, hit, filters }                                = this.props;
    const { _source: { mdb_uid: mdbUid, title }, highlight } = hit;

    const name = this.titleFromHighlight(highlight, title);

    return (
      <Segment verticalalign="top" className="bgHoverGrey search__block">
        <Header as='h3'>
          <Link
            className="search__link"
            to={canonicalLink({ id: mdbUid, content_type: 'SOURCE' })}
            language={this.getMediaLanguage(filters)}>
            {name}
          </Link>
        </Header>
        <Container>
          <Image size="mini" src={sectionLogo.sources} verticalAlign='middle' />&nbsp;
          <span>{t('filters.sections-filter.sources')}</span>
        </Container>
        <Container className="content">
          {this.snippetFromHighlight(highlight)}
        </Container>
        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default connect(state => ({
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
}))(SearchResultSource);
