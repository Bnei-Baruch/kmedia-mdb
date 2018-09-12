import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Segment, Image, } from 'semantic-ui-react';
import { canonicalLink } from '../../helpers/links';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';

class SearchResultSource extends Component {

  static propTypes = {
    hit: PropTypes.object,
  };

  render() {
    const { t, getSourcePath, hit, snippetFromHighlight } = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, }    = hit;

    const srcPath = getSourcePath(mdbUid);

    const name = snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || srcPath[srcPath.length - 1].name;

    const authors = snippetFromHighlight(highlight, ['authors', 'authors_analyzed'], parts => parts[0]);
    if (authors) {
      // Remove author from path in order to replace with highlight value.
      srcPath.pop();
    }

    const path = `${srcPath.slice(0, -1).map(n => n.name).join(' > ')}`;

    return (
      <Segment key={mdbUid} verticalalign="top" className="bgHoverGrey">
        <Link
          className="search__link"
          to={canonicalLink({ id: mdbUid, content_type: 'SOURCE' })}>

          {name} / {authors}&nbsp;{path}
          <div>
            <Image src={sectionLogo.sources} />&nbsp;
            {t('filters.sections-filter.sources')}
          </div>
        </Link>
      </Segment>
    );
  }
}

export default connect(state => ({
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
}))(translate()(SearchResultSource));
