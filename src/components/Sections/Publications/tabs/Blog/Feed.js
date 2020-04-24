import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as shapes from '../../../../shapes';
import { renderBlogItemForHomepage, renderBlogItemForPublications } from './renderFeedHelpers';

const BlogFeed = ({ items = [], snippetVersion = false, limitLength = null, language }) => {
  const { t }  = useTranslation('common', { useSuspense: false });
  const length = limitLength || items.length;

  return (
    <div className="blog-posts">
      {
        snippetVersion
          ? items.slice(0, length).map(item => renderBlogItemForHomepage(item, language, t))
          : items.map(item => renderBlogItemForPublications(item, language))
      }
    </div>
  );
};

BlogFeed.propTypes = {
  items: PropTypes.arrayOf(shapes.BlogPost),
  snippetVersion: PropTypes.bool,
  limitLength: PropTypes.number,
  language: PropTypes.string.isRequired,
};

export default BlogFeed;
