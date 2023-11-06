import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import { Header } from 'semantic-ui-react';
import Link from 'next/link';

import { selectors as settings } from '/lib/redux/slices/settingsSlice/settingsSlice';

const BlogFeed = ({ item }) => {
  const { t }  = useTranslation();
  const uiLang = useSelector(state => settings.getUILang(state.settings));

  const { url, title, content, created_at: ts } = item;

  const mts         = moment(ts);
  const internalUrl = `/${uiLang}/publications/blog/${item.blog}/${item.wp_id}`;
  const dir         = item.blog.includes('il') ? 'rtl' : 'ltr';

  const pHtml = `<span class="date">${mts.format('lll')} - </span>${content.replace(/href="\/publications\/blog\//gi, `href="/${uiLang}/publications/blog/`)}<section>...</section></section>`;

  return (
    <div key={url} className="post" style={{ direction: dir }}>
      <Header color="blue">
        <a className="remove-indent" href={internalUrl} dangerouslySetInnerHTML={{ __html: title }} />
      </Header>
      <div>
        <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
        <Link className="read-more-link remove-indent" href={internalUrl}>{t('publications.read-more')}</Link>
      </div>
    </div>
  );
};

export default BlogFeed;
