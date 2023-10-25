import React from 'react';
import moment from 'moment';
import { Header, Segment } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice';

const BlogFeed = ({ item }) => {

  const uiLang = useSelector(state => settings.getUILang(state.settings));

  const { url, title, content, created_at: ts } = item;
  const mts                                     = moment(ts);
  const dir                                     = item.blog.includes('il') ? 'rtl' : 'ltr';

  const pHtml = content.replace(/href="\/publications\/blog\//gi, `href="/${uiLang}/publications/blog/`);

  return (
    <div key={url} className="post" style={{ direction: dir }}>
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
export default BlogFeed;
