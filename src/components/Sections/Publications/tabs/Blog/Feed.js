import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Header, Segment } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';

class BlogFeed extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(shapes.BlogPost),
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  renderItem = (item) => {
    const { language }                            = this.props;
    const { url, title, content, created_at: ts } = item;
    const mts                                     = moment(ts);

    const pHtml = content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`);

    return (
      <div key={url} className="post">
        <Header>
          <div dangerouslySetInnerHTML={{ __html: title }} />
          <Header.Subheader>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {mts.format('lll')}
            </a>
          </Header.Subheader>
        </Header>
        <Segment basic>
          <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
        </Segment>
      </div>
    );
  };

  render() {
    const { items } = this.props;

    return (
      <div className="blog-posts">
        {items.map(this.renderItem)}
      </div>
    );
  }
}

export default BlogFeed;
