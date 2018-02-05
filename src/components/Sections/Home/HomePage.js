import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Card, Container, Grid, } from 'semantic-ui-react';

import { canonicalLink, strCmp } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import SearchBar from './SearchBar';
import Promoted from './Promoted';
import Topic from './Topic';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import LatestDailyLesson from './LatestDailyLesson';
import DailyLessonsIcon from '../../../images/icons/dailylessons.svg';
import ProgramsIcon from '../../../images/icons/programs.svg';
import LecturesIcon from '../../../images/icons/lectures.svg';
import SourcesIcon from '../../../images/icons/sources.svg';
import EventsIcon from '../../../images/icons/events.svg';
import PublicationsIcon from '../../../images/icons/publications.svg';

class HomePage extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    latestLesson: shapes.LessonCollection,
    latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
    banner: shapes.Banner,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    banner: null,
    wip: false,
    err: null,
  };

  render() {
    const { t, location, latestLesson, latestUnits, banner } = this.props;

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
      let v         = acc[section];
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
        <Container className="padded">
          <SearchBar t={t} location={location} />
        </Container>

        <div className="homepage__featured">
          <Container className="padded">
            <Grid centered>
              <Grid.Row>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <LatestDailyLesson collection={latestLesson} t={t} />
                </Grid.Column>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <Promoted banner={banner} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        <Container className="padded homepage__sections">
          <Section title={t('home.sections')}>
            <Grid doubling columns={6} className="homepage__iconsrow">
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.lessons')} img={DailyLessonsIcon} href="/lessons" />
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.programs')} img={ProgramsIcon} href="/programs" />
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.lectures')} img={LecturesIcon} href="/lectures" />
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.sources')} img={SourcesIcon} href="/sources" />
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.events')} img={EventsIcon} href="/events" />
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Topic title={t('nav.sidebar.publications')} img={PublicationsIcon} href="/publications" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Section>

          <Section title={t('home.updates')}>
            <Card.Group itemsPerRow={4} doubling>
              {
                sortedCUs.slice(0, 4).map(x => {
                  const [section, unit] = x;
                  return <LatestUpdate key={section} unit={unit} label={t(`nav.sidebar.${section}`)} t={t} />;
                })
              }
            </Card.Group>
          </Section>

        </Container>
      </div>
    );
  }
}

export default translate()(HomePage);
