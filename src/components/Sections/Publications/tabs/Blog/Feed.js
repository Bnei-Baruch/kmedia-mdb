import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Header, Segment } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import Link from '../../../../Language/MultiLanguageLink';

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

  renderItem = (item) => {
    const { snippetVersion, t, language }         = this.props;
    const { url, title, content, created_at: ts } = item;
    const mts                                     = moment(ts);
    const internalUrl                             = `/${language}/publications/blog/${item.blog}/${item.wp_id}`;

    const pHtml = `${content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`)} <div class="fade-text"></div>`;

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
          {
            snippetVersion ? <Link to={internalUrl}>{t('publications.read-more')}</Link> : null
          }
        </Segment>
        {
          snippetVersion ? <Divider /> : null
        }
      </div>
    );
  };

  render() {
    const { items, limitLength } = this.props;
    const length                 = limitLength || items.length;

    return (
      <div className="blog-posts">
        {items.slice(0, length).map(this.renderItem)}
      </div>
    );
  }
}

export default BlogFeed;
