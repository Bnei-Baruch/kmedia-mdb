import React from 'react';
import moment from 'moment';

import * as shapes from '../../../../../shapes';
import Helmets from '../../../../../shared/Helmets/index';
import WipErr from '../../../../../shared/WipErr/WipErr';
import Share from '../../../../../Pages/WithText/Buttons/ShareTextBtn';
import { getBlogLanguage, isLanguageRtl } from '../../../../../../helpers/i18n-utils';

export const BlogPostPage = ({ post = null, wip = false, err = null }) => {
  const wipErr = WipErr({ wip, err });

  if (wipErr) {
    return wipErr;
  }

  if (!post) {
    return null;
  }

  const language = getBlogLanguage(post.blog);
  const { url, title, content, created_at: ts } = post;
  const mts = moment(ts);
  const pHtml = content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`);

  const isRtl = isLanguageRtl(language);
  const position = isRtl ? 'right' : 'left';

  return (
    <div className="blog-post">
      <Helmets.NoIndex />
      <div className="section-header">
        <div className=" px-1 ">
          <div>
            <div>
              <h1>
                <div dangerouslySetInnerHTML={{ __html: title }} />
              </h1>
              <h4 className="text-gray-500 display-inline">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mts.format('lll')}
                </a>
              </h4>
              <span className="share-publication">
                <Share position={position} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 post">
          <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
        </div>
      </div>
    </div>
  );
};

BlogPostPage.propTypes = {
  post: shapes.BlogPost,
  wip: shapes.WIP,
  err: shapes.Error,
};

export default BlogPostPage;
