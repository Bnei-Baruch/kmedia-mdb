/* eslint-disable */

import React, { Component } from 'react';
import { Card, Container, Grid, } from 'semantic-ui-react';
import DailyLessonsIcon from '../../../images/icons/dailylessons.svg';
import ProgramsIcon from '../../../images/icons/programs.svg';
import LecturesIcon from '../../../images/icons/lectures.svg';
import SourcesIcon from '../../../images/icons/sources.svg';
import EventsIcon from '../../../images/icons/events.svg';
import PublicationsIcon from '../../../images/icons/publications.svg';
import SearchBar from './SearchBar';
import Promoted from './Promoted';
import Topic from './Topic';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/home';
import { selectors as settings } from '../../../redux/modules/settings';

import { bindActionCreators } from 'redux';
import LatestDailyLesson from './LatestDailyLesson';
import PropTypes from 'prop-types';

class HomePage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired
  };

  componentDidMount() {

    // TODO: this should be much smarter...
    // we should try to avoid loading data as much as possible
    this.props.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.props.fetchData();
    }
  }

  render() {
    const { t, location, data } = this.props;

    if (!data) {
      return null;
    }

    return (
      <div className='homepage'>
        <Container className='padded'>
          <SearchBar t={t} location={location} title={t('homePage.searchTitle')} />
        </Container>
        <div className='homepage__featured'>
          <Container className='padded'>
            <Grid centered>
              <Grid.Row>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <LatestDailyLesson
                    unit={data.LatestDailyLesson}
                  />
                </Grid.Column>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <Promoted
                    image={data.Promoted.Image}
                    title={data.Promoted.Header}
                    subTitle={data.Promoted.SubHeader}
                    label={t('nav.sidebar.events')}
                    href={data.Promoted.Url}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Container className='padded homepage__sections'>
          <Section
            title={t('homePage.archiveSection')}
            className='homepage__iconsrow'
          >
            <Grid doubling columns={6}>
              <Grid.Row>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.lessons')}
                    img={DailyLessonsIcon}
                    href='/lessons' />
                </Grid.Column>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.programs')}
                    img={ProgramsIcon}
                    href='/programs' />
                </Grid.Column>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.lectures')}
                    img={LecturesIcon}
                    href='/lectures' />
                </Grid.Column>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.sources')}
                    img={SourcesIcon}
                    href='/sources' />
                </Grid.Column>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.events')}
                    img={EventsIcon}
                    href='/events' />
                </Grid.Column>
                <Grid.Column>
                  <Topic
                    title={t('nav.sidebar.publications')}
                    img={PublicationsIcon}
                    href='/publications' />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Section>

          <Section title={t('homePage.latestUpdates')}>
            <Card.Group itemsPerRow='4' doubling>
              <LatestUpdate
                unit={data.LatestContentUnits.lesson}
                label={t('nav.sidebar.lessons')}
              />
              <LatestUpdate
                unit={data.LatestContentUnits.lecture}
                label={t('nav.sidebar.lectures')}

              />
              <LatestUpdate
                unit={data.LatestContentUnits.program}
                label={t('nav.sidebar.programs')}
              />
              <LatestUpdate
                unit={data.LatestContentUnits.event}
                label={t('nav.sidebar.events')}
              />
            </Card.Group>
          </Section>

        </Container>
      </div>
    );
  }
}

const mapState = state => ({
  data: selectors.getData(state.home),
  wip: selectors.getWip(state.home),
  err: selectors.getError(state.home),
  language: settings.getLanguage(state.settings)
});

const mapDispatch = dispatch => bindActionCreators({
  fetchData: actions.fetchData,
}, dispatch);

export default connect(mapState, mapDispatch)(translate()(HomePage));
