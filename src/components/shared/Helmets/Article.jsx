import PropTypes from 'prop-types';
import { Helmet } from './helmetESM';

import { isEmpty } from '../../../helpers/utils';

const Article = props => {
  const { publishedTime = null, tags = [], section = '' } = props;

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
          ? <meta property="article:published_time" content={publishedTime} />
          : null
      }

      {tags.map(tag => <meta property="article:tag" key={tag} content={tag} />)}
    </Helmet>
  );
};

Article.propTypes = {
  publishedTime: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  section: PropTypes.string, // A high-level section name. E.g. Technology
};

export default Article;
