import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import * as shapes from '../../../../shapes';
import { renderBlogItemForHomepage, renderBlogItemForPublications } from './renderFeedHelpers';
import { settingsGetUILangSelector } from '../../../../../redux/selectors';

const BlogFeed = ({ items = [], snippetVersion = false, limitLength = null, t }) => {
  const uiLang = useSelector(settingsGetUILangSelector);
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
  items         : PropTypes.arrayOf(shapes.BlogPost),
  snippetVersion: PropTypes.bool,
  limitLength   : PropTypes.number,
  t             : PropTypes.func.isRequired
};

export default withTranslation()(BlogFeed);
