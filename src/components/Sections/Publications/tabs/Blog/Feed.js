import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

import { selectors as settings } from '../../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import * as shapes from '../../../../shapes';
import { renderBlogItemForHomepage, renderBlogItemForPublications } from './renderFeedHelpers';

const BlogFeed = ({ items = [], snippetVersion = false, limitLength = null, t }) => {
  const uiLang = useSelector(state => settings.getUILang(state.settings));
  const length = limitLength || items.length;

  return (
    <div className="blog-posts">
      {
        snippetVersion
          ? items.slice(0, length).map(item => renderBlogItemForHomepage(item, uiLang, t))
          : items.map(item => renderBlogItemForPublications(item, uiLang))
      }
    </div>
  );
};

BlogFeed.propTypes = {
  items: PropTypes.arrayOf(shapes.BlogPost),
  snippetVersion: PropTypes.bool,
  limitLength: PropTypes.number,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(BlogFeed);
