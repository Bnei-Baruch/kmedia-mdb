import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import * as shapes from '../../../../shapes';
import { renderBlogItemForHomepage, renderBlogItemForPublications } from './renderFeedHelpers';

class BlogFeed extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(shapes.BlogPost),
    snippetVersion: PropTypes.bool,
    limitLength: PropTypes.number,
    t: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
    snippetVersion: false,
    limitLength: null
  };

  render() {
    const { items, snippetVersion, limitLength, t, language } = this.props;
    const length                                              = limitLength || items.length;

    return (
      <div className="blog-posts">
        {
          snippetVersion ?
            items.slice(0, length).map(item => renderBlogItemForHomepage(item, language, t)) :
            items.map(item => renderBlogItemForPublications(item, language))
        }
      </div>
    );
  }
}

export default withNamespaces()(BlogFeed);
