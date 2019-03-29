import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { isEmpty } from '../../../helpers/utils';

class Article extends Component {
  static propTypes = {
    publishedTime: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    section: PropTypes.string, // A high-level section name. E.g. Technology
  };

  static defaultProps = {
    publishedTime: null,
    tags: [],
    section: '', // TODO: Kabbalah ? Spirituality
  };

  render() {
    const { publishedTime, tags, section } = this.props;

    return (
      <Helmet>
        <meta property="og:type" content="article" />
        {
          !isEmpty(section)
            ? <meta property="article:section" content={section} />
            : null
        }

        {
          !isEmpty(publishedTime)
            ? <meta name="article:published_time" content={publishedTime} />
            : null
        }

        {tags.map(tag => <meta name="article:tag" key={tag} content={tag} />)}
      </Helmet>
    );
  }
}

export default Article;
