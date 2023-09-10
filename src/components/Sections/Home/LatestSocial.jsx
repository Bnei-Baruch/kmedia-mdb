import { Grid, Feed, Container } from 'semantic-ui-react';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { isEmpty } from '../../../helpers/utils';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';
import Section from './Section';
import { useSelector } from 'react-redux';
import { selectors as publications } from '../../../../lib/redux/slices/publicationsSlice';

const LatestSocial = () => {
  const { t } = useTranslation();

  const latestBlogPosts = useSelector(state => publications.getBlogPosts(state.publications));
  const latestTweets    = useSelector(state => publications.getTweets(state.publications));

  const hasTweets = !isEmpty(latestTweets);
  const hasBlogs  = !isEmpty(latestBlogPosts);

  if (!hasTweets && !hasBlogs) return;

  return (
    <div className="homepage__section home-social-section">
      <Container className="padded horizontally ">
        <Section title={t('home.social')} computer={13}>
          <Grid centered className="homepage__iconsrow socialBackground">
            <Grid.Row>
              {
                hasBlogs
                && (
                  <Grid.Column mobile={16} tablet={11} computer={11} className="home-blog-posts">
                    <div className="titles">
                      <h4>{t('home.blog-title')}</h4>
                    </div>
                    <BlogFeed snippetVersion items={latestBlogPosts} limitLength={4} />
                    <div className="read-more-bottom">
                      <a href={`/${uiLang}/publications/blog`}>{t('home.read-more-posts')}</a>
                    </div>
                  </Grid.Column>
                )
              }
              {
                hasTweets
                && (
                  <Grid.Column mobile={16} tablet={5} computer={5} className="home-twitter">
                    <div className="titles">
                      <h4>{t('home.twitter-title')}</h4>
                    </div>
                    <Feed>
                      {
                        latestTweets.slice(0, 4).map(item => <TwitterFeed twitter={item} key={item.twitter_id} />)
                      }
                    </Feed>
                    <div className="read-more-bottom">
                      <a href={`/${uiLang}/publications/twitter`}>{t('home.read-more-tweets')}</a>
                    </div>
                  </Grid.Column>
                )
              }
            </Grid.Row>
          </Grid>
        </Section>
      </Container>
    </div>
  );
};

export default LatestSocial;
