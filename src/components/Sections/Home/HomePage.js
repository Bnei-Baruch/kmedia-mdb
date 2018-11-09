import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Card, Container, Grid } from 'semantic-ui-react';

import { sectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { strCmp } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Helmets from '../../shared/Helmets';
import SearchBar from './SearchBar';
import Promoted from './Promoted';
import Topic from './Topic';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import LatestDailyLesson from './LatestDailyLesson';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';

class HomePage extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    latestLesson: shapes.LessonCollection,
    latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
    latestBlogPosts: PropTypes.arrayOf(shapes.BlogPost),
    latestTweets: PropTypes.arrayOf(shapes.Tweet),
    banner: shapes.Banner,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    latestBlogPosts: [],
    latestTweets: [],
    banner: null,
    wip: false,
    err: null,
  };

  render() {
    const
      {
        latestLesson,
        latestUnits,
        latestBlogPosts,
        latestTweets,
        banner,
        language,
        wip,
        err,
        t,
        location
      } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!latestLesson) {
      return null;
    }

    // map units to sections
    const cuBySection = latestUnits.reduce((acc, val) => {
      const s = canonicalLink(val).split('/');
      if (s.length < 3) {
        return acc;
      }

      const section = s[1];
      const v       = acc[section];
      if (v) {
        if (v.film_date < val.film_date) {
          acc[section] = val;
        }
      } else {
        acc[section] = val;
      }

      return acc;
    }, {});

    // sort sections based on their units
    // we only have 4 slots and > 4 sections ...
    const sortedCUs = Object.entries(cuBySection).sort((a, b) => strCmp(b[1].film_date, a[1].film_date));

    return (
      <div className="homepage">
        <Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />

        <div className="homepage__header homepage__section">
          <Container className="padded horizontally">
            <SearchBar t={t} location={location} />
          </Container>
        </div>

        <div className="homepage__featured homepage__section">
          <Container className="padded horizontally">
            <Grid centered>
              <Grid.Row>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <LatestDailyLesson collection={latestLesson} t={t} />
                </Grid.Column>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <Promoted banner={banner} t={t} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        <div className="homepage__website-sections homepage__section">
          <Container className="padded horizontally">
            <Section title={t('home.sections')}>
              <Grid width={15} centered className="homepage__iconsrow">
                <Grid.Row>
                  {
                    ['lessons', 'programs', 'sources', 'events', 'publications'].map(x =>
                      (
                        <Grid.Column mobile={5} tablet={3} computer={3} key={x} textAlign="center">
                          <Topic title={t(`nav.sidebar.${x}`)} img={sectionLogo[x]} href={`/${x}`} />
                        </Grid.Column>
                      )
                    )
                  }
                  <Grid.Column mobile={5} tablet={3} computer={3} only="mobile" />
                </Grid.Row>
              </Grid>
            </Section>
          </Container>
        </div>

        <div className="homepage__thumbnails homepage__section">
          <Container className="padded horizontally">
            <Section title={t('home.updates')}>
              <Card.Group itemsPerRow={4} doubling>
                {
                  sortedCUs.slice(0, 4).map((x) => {
                    const [section, unit] = x;
                    return <LatestUpdate key={section} unit={unit} label={t(`nav.sidebar.${section}`)} t={t} />;
                  })
                }
              </Card.Group>
            </Section>
          </Container>
        </div>

        <div className="homepage__section home-social-section">
          <Container className="padded horizontally ">
            <Section title={t('home.social')}>
              <Grid width={15} centered className="homepage__iconsrow">
                <Grid.Row>
                  {
                    latestBlogPosts.length ?
                      <Grid.Column mobile={16} tablet={11} computer={11} className="home-blog-posts">
                        <div className="titles">
                          <h4>{t('home.blog-title')}</h4>
                          <a href={`/${language}/publications/blog`}>{t('home.all-posts')}</a>
                        </div>
                        <BlogFeed snippetVersion items={latestBlogPosts} language={language} t={t} limitLength={4} />
                        <div className="read-more-bottom">
                          <a href={`/${language}/publications/blog`}>{t('home.read-more-posts')}</a>
                        </div>
                      </Grid.Column> :
                      null
                  }
                  {
                    latestTweets.length ?
                      <Grid.Column mobile={16} tablet={5} computer={5} className="home-twitter">
                        <div className="titles">
                          <h4>{t('home.twitter-title')}</h4>
                          <a href={`/${language}/publications/twitter`}>{t('home.all-tweets')}</a>
                        </div>
                        <TwitterFeed snippetVersion tweets={latestTweets} t={t} limitLength={4} />
                        <div className="read-more-bottom">
                          <a href={`/${language}/publications/twitter`}>{t('home.read-more-tweets')}</a>
                        </div>
                      </Grid.Column> :
                      null
                  }
                </Grid.Row>
              </Grid>
            </Section>
          </Container>
        </div>
      </div>
    );
  }
}

export default translate()(HomePage);
