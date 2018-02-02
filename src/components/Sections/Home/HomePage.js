/* eslint-disable */

import React, { Component } from 'react';
import { Card, Container, Grid, } from 'semantic-ui-react';
import DailyLessonPlaceholder from '../../../images/hp_lesson_temp.png';
import DailyLessonsIcon from '../../../images/icons/dailylessons.svg';
import ProgramsIcon from '../../../images/icons/programs.svg';
import LecturesIcon from '../../../images/icons/lectures.svg';
import SourcesIcon from '../../../images/icons/sources.svg';
import EventsIcon from '../../../images/icons/events.svg';
import PublicationsIcon from '../../../images/icons/publications.svg';
import SearchBar from './SearchBar';
import Featured from './Featured';
import Topic from './Topic';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/home';
import { bindActionCreators } from 'redux';

//
// const Data = {
//   "LatestDailyLesson": {
//     "id": "lg0UKPsg",
//     "content_type": "DAILY_LESSON",
//     "film_date": "2017-10-24"
//   },
//   "Promoted": {
//     "Section": "Events",
//     "SubHeader": "February 2018",
//     "Header": "The World Kabbalah Congress",
//     "Url": "http://www.kab.co.il/kabbalah/%D7%9B%D7%A0%D7%A1-%D7%A7%D7%91%D7%9C%D7%94-%D7%9C%D7%A2%D7%9D-%D7%94%D7%A2%D7%95%D7%9C%D7%9E%D7%99-2018-%D7%9B%D7%95%D7%9C%D7%A0%D7%95-%D7%9E%D7%A9%D7%A4%D7%97%D7%94-%D7%90%D7%97%D7%AA",
//     "Image": "/static/media/hp_featured_temp.cca39640.jpg"
//   },
//   "LatestContentUnits": [
//     {
//       "id": "kvHFhL2Z",
//       "content_type": "LESSON_PART",
//       "film_date": "2018-01-29",
//       "name": "Preparation to the Lesson",
//       "duration": 694,
//       "original_language": "he",
//       "collections": {
//         "0ijpKZPZ____0": {
//           "id": "kvH0ijpKZPZFhL2Z",
//           "content_type": "DAILY_LESSON",
//           "film_date": "2018-01-29"
//         }
//       }
//     },
//     {
//       "id": "aUGdhjQC",
//       "content_type": "VIRTUAL_LESSON",
//       "film_date": "2018-01-29",
//       "name": "mlt_o_rav_2017-10-22_vl_webinar_kak-obshayutsia-kabbalisti",
//       "duration": 3644,
//       "original_language": "ru",
//       "collections": {
//         "VwCQ0OBq____0": {
//           "id": "VwCQ0OBq",
//           "content_type": "VIRTUAL_LESSON",
//           "default_language": "ru"
//         }
//       }
//     },
//     {
//       "id": "QUgJI8T3",
//       "content_type": "VIDEO_PROGRAM_CHAPTER",
//       "film_date": "2018-01-29",
//       "name": "heb_o_rav_2017-09-28_program_haim-hadashim-ktaim_n668",
//       "duration": 856,
//       "original_language": "he",
//       "collections": {
//         "G30TMsPn____668": {
//           "id": "G30TMsPn",
//           "content_type": "VIDEO_PROGRAM",
//           "name": "A New Life. Excerpts",
//           "default_language": "he"
//         }
//       }
//     },
//     {
//       "id": "KqKa8COz",
//       "content_type": "FRIENDS_GATHERING",
//       "film_date": "2018-01-29",
//       "name": "mlt_o_norav_2017-10-22_yeshivat-haverim_n1",
//       "duration": 2921,
//       "original_language": "he"
//     }
//   ],
//   "PopularTopics": [
//     {
//       "Title": "Conception",
//       "Url": "#",
//       "Image": "http://www.thefertilebody.com/Content/Images/UploadedImages/a931e8de-3798-4332-8055-ea5b041dc0b0/ShopItemImage/conception.jpg"
//     },
//     {
//       "Title": "The role of women in the spiritual system",
//       "Url": "#",
//       "Image": "https://images-na.ssl-images-amazon.com/images/I/71mpCuqBFaL._SY717_.jpg"
//     }
//   ]
// };

class HomePage extends Component {

  componentDidMount() {

    // TODO: this should be much smarter...
    // we should try to avoid loading data as much as possible
    this.props.fetchData();
  }

  render() {
    const { t, location } = this.props;

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
                  <Featured
                    thumbnail={DailyLessonPlaceholder}
                    title='The Latest Daily Lesson'
                    subTitle='1/10/2018'
                    label={t('nav.sidebar.lessons')}
                    href='/programs'

                  />
                </Grid.Column>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  {/*<Featured*/}
                  {/*thumbnail={Data.PropTypes.Image}*/}
                  {/*title={Data.PropTypes.Header}*/}
                  {/*subTitle={Data.PropTypes.SubHeader}*/}
                  {/*label={Data.PropTypes.Section}*/}
                  {/*href={Data.PropTypes.Url}*/}
                  {/*/>*/}
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
                  <Topic title={t('nav.sidebar.lessons')} img={DailyLessonsIcon} href='/lessons' />
                </Grid.Column>
                <Grid.Column>
                  <Topic title={t('nav.sidebar.programs')} img={ProgramsIcon} href='/programs' />
                </Grid.Column>
                <Grid.Column>
                  <Topic title={t('nav.sidebar.lectures')} img={LecturesIcon} href='/lectures' />
                </Grid.Column>
                <Grid.Column>
                  <Topic title={t('nav.sidebar.sources')} img={SourcesIcon} href='/sources' />
                </Grid.Column>
                <Grid.Column>
                  <Topic title={t('nav.sidebar.events')} img={EventsIcon} href='/events' />
                </Grid.Column>
                <Grid.Column>
                  <Topic title={t('nav.sidebar.publications')} img={PublicationsIcon} href='/publications' /></Grid.Column>
              </Grid.Row>
            </Grid>
          </Section>

          <Section title={t('homePage.latestUpdates')}>
            <Card.Group itemsPerRow='4' doubling>
              <LatestUpdate
                img='https://archive.kbb1.com/assets/api/thumbnail/64RFGZR6'
                title='Baal HaSulam. Introduction to The Book of Zohar'
                subTitle='1/16/2018'
                label='Daily Lessons'
                href=''
              />
              <LatestUpdate
                img='https://archive.kbb1.com/assets/api/thumbnail/tSmGoUDU'
                title='Webinar with Dr. Michael Laitman'
                subTitle='12/24/2017'
                label='Lectures & Lessons'

              />
              <LatestUpdate
                img='https://archive.kbb1.com/assets/api/thumbnail/fc3bAksF'
                title='A New Life 949'
                subTitle='1/16/2018'
                label='Programs'
                href=''
              />
              <LatestUpdate
                img='https://archive.kbb1.com/assets/api/thumbnail/JnAbkx0l'
                title='World Convention 2018'
                subTitle='1/16/2018'
                label='Events'
                href=''
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
});

const mapDispatch = dispatch => bindActionCreators({
  fetchData: actions.fetchData,
}, dispatch);

export default connect(mapState, mapDispatch)(translate()(HomePage));
