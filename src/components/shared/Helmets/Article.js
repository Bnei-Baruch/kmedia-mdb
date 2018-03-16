import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

class Article extends Component {
  static propTypes = {
    publishedTime: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    section: PropTypes.string, // A high-level section name. E.g. Technology
    // authorUrl : should be a url to a page with og:profile meta tags
  };

  static defaultProps = {
    publishedTime: null,
    tags: [],
    // section: TODO: Kaballah ? Spirituality
  };

  render() {
    const { publishedTime, tags, section } = this.props;

    return (
      <Helmet>
        <meta property="og:type" content="article" />
        {section ? <meta property="article:section" content={section} /> : null}

        {publishedTime ? <meta name="article:published_time" content={publishedTime} /> : null}
        {tags.map((tag, index) => <meta name="article:tag" content={tag} key={index} />)}
      </Helmet>
    );
  }
}

export default Article;
