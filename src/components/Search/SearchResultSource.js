import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Segment, Image, } from 'semantic-ui-react';
import { canonicalLink } from '../../helpers/links';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultSource extends SearchResultBase {

  render() {
    const { t, hit }                                          = this.props;
    const { _source: { mdb_uid: mdbUid, title }, highlight, } = hit;

    const name = this.titleFromHighlight(highlight, title);

    return (
      <Segment key={mdbUid} verticalalign="top" className="bgHoverGrey">
        <Link
          className="search__link"
          to={canonicalLink({ id: mdbUid, content_type: 'SOURCE' })}>
          {name}
        </Link>

        <div>
          <Image size="mini" src={sectionLogo.sources} verticalAlign='middle' />&nbsp;
          <span>{t('filters.sections-filter.sources')}</span>
        </div>
      </Segment>
    );
  }
}

export default connect(state => ({
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
}))(translate()(SearchResultSource));
