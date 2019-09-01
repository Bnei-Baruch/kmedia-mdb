import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { isEmpty } from '../../../helpers/utils';

const Article = (props) => {
  const { publishedTime, tags, section } = props;

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
};

Article.propTypes = {
  publishedTime: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  section: PropTypes.string, // A high-level section name. E.g. Technology
};

Article.defaultProps = {
  publishedTime: null,
  tags: [],
  section: '', // TODO: Kabbalah ? Spirituality
};

export default Article;
