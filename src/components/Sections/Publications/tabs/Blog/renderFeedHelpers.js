import React from 'react';
import moment from 'moment';
import { Header, Segment } from 'semantic-ui-react';

import Link from '../../../../Language/MultiLanguageLink';

export const renderBlogItemForHomepage = (item, uiLang, t) => {
  const { url, title, content, created_at: ts } = item;
  const mts = moment(ts);
  const internalUrl = `/${uiLang}/publications/blog/${item.blog}/${item.wp_id}`;
  const dir = item.blog.includes('il') ? 'rtl' : 'ltr';

  const pHtml = `<span class="date">${mts.format('lll')} - </span>${content.replace(/href="\/publications\/blog\//gi, `href="/${uiLang}/publications/blog/`)}<section>...</section></section>`;

  return (
    <div key={url} className="post" style={{direction: dir}}>
      <Header color="blue">
        <a className="remove-indent" href={internalUrl} dangerouslySetInnerHTML={{ __html: title }} />
      </Header>
      <div>
        <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
        <Link className="read-more-link remove-indent" to={internalUrl}>{t('publications.read-more')}</Link>
      </div>
    </div>
  );
};

export const renderBlogItemForPublications = (item, uiLang) => {
  const { url, title, content, created_at: ts } = item;
  const mts = moment(ts);
  const dir = item.blog.includes('il') ? 'rtl' : 'ltr';

  const pHtml = content.replace(/href="\/publications\/blog\//gi, `href="/${uiLang}/publications/blog/`);

  return (
    <div key={url} className="post" style={{direction: dir}}>
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
