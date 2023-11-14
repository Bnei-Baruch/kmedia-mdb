import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import Helmets from '../../../../../shared/Helmets/index';
import WipErr from '../../../../../shared/WipErr/WipErr';
import Share from '../../../../Library/Share';
import { getBlogLanguage, isLanguageRtl } from '../../../../../../helpers/i18n-utils';

export const BlogPostPage = ({ post = null, wip = false, err = null, t }) => {
  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!post) {
    return null;
  }

  const language = getBlogLanguage(post.blog);
  const { url, title, content, created_at: ts } = post;
  const mts                                     = moment(ts);
  const pHtml                                   = content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`);

  const isRtl    = isLanguageRtl(language);
  const position = isRtl ? 'right' : 'left';

  return (
    <div className="blog-post">
      <Helmets.NoIndex />
      <div className="section-header">
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1">
                  <Header.Content>
                    <div dangerouslySetInnerHTML={{ __html: title }} />
                  </Header.Content>
                </Header>
                <Header as="h4" color="grey" className="display-inline">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mts.format('lll')}
                  </a>
                </Header>
                <span className="share-publication">
                  <Share position={position} />
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={8} className="post">
              <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

BlogPostPage.propTypes = {
  post: shapes.BlogPost,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(BlogPostPage);
