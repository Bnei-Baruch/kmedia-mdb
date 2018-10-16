import React from 'react';
import moment from 'moment';
import { Divider, Header, Segment } from 'semantic-ui-react';

import Link from '../../../../Language/MultiLanguageLink';

export const renderBlogItemForHomepage = (item, language, t) => {
  const { url, title, content, created_at: ts } = item;
  const mts                                     = moment(ts);
  const internalUrl                             = `/${language}/publications/blog/${item.blog}/${item.wp_id}`;

  const pHtml = `<span class="date">${mts.format('lll')} - </span>${content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`)}<section>...</section></section>`;

  return (
    <div key={url} className="post">
      <Header color="blue">
        <a href={internalUrl} dangerouslySetInnerHTML={{ __html: title }} />
      </Header>
      <div>
        <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
        <p></p>
        <Link className="read-more-link" to={internalUrl}>{t('publications.read-more')}</Link>
      </div>
      <Divider />
    </div>
  );
};

export const renderBlogItemForPublications = (item, language) => {
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
