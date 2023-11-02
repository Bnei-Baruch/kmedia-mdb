import React from 'react';

import { getBlogLanguage, isLanguageRtl } from '../../../../../src/helpers/i18n-utils';
import moment from 'moment/moment';
import Helmets from '../../../../../src/components/shared/Helmets';
import { Container, Grid, Header } from 'semantic-ui-react';
import Share from '../../../../../src/components/Sections/Library/Share';
import { wrapper } from '../../../../../lib/redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DEFAULT_CONTENT_LANGUAGE } from '../../../../../src/helpers/consts';
import Api from '../../../../../src/helpers/Api';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang         = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const { blog, id } = context.params;

  const { data } = await Api.post(blog, id);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, ...data } };
});

const BlogPostPage = ({ url, title, content, created_at: ts, blog }) => {
  const language = getBlogLanguage(blog);
  const mts      = moment(ts);
  const pHtml    = content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`);

  const isRtl    = isLanguageRtl(language);
  const position = isRtl ? 'right' : 'left';

  return (
    <div className="blog-post">
      {/*<Helmets.NoIndex />*/}
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

export default BlogPostPage;
