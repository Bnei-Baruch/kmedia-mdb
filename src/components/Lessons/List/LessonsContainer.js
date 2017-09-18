import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Container, Header, Grid } from 'semantic-ui-react';

import { CT_LESSON_PART } from '../../../helpers/consts';
import { actions, selectors as lessonSelectors } from '../../../redux/modules/lessons';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import LessonsFilters from './LessonsFilters';
import LessonsList from './LessonsList';
import withPagination from '../../pagination/withPagination';

class LessonsContainer extends withPagination {

  static propTypes = {
    pageSize: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
  };

  static defaultProps = {
    items: [],
    isFiltersHydrated: false,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      withPagination.askForData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      withPagination.askForData(nextProps);
    }

    super.componentWillReceiveProps(nextProps);
  }

  render() {
    const { items } = this.props;

    return (
      <div>
        <div className='section-header'>
          <Container className='padded'>
            <Grid>
              <Grid.Row>
                <Grid.Column computer={10} tablet={12} mobile={16}>
                  <Header as='h1' color='blue'>
                    <Header.Content>
                      Daily Lessons
                      <Header.Subheader>
                        The daily acceptance rate is delivered by Rabbi Dr. Michael Laitman to millions of viewers around the world, every night between 3-6 clock Israel, and describes the spiritual flow that humanity today.
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Divider fitted/>
        <LessonsFilters
          onChange={() => withPagination.handlePageChange(this.props, 1)}
          onHydrated={() => withPagination.handlePageChange(this.props)}
        />
        <Container className='padded'>
            <withPagination.ResultsPageHeader {...this.props} />

            <LessonsList items={items} />
        </Container>
        <Divider fitted />
        <Container className='padded' textAlign='center'>
          <withPagination.Pagination {...this.props} />
        </Container>
      </div>
    );
  }
}

const mapState = (state) => {
  const parentProps = withPagination.mapState('lessons', state, lessonSelectors, settings);
  return {
    ...parentProps,
    items: lessonSelectors.getItems(state.lessons)
      .map(x => (x[1] === CT_LESSON_PART ?
        mdb.getDenormContentUnit(state.mdb, x[0]) :
        mdb.getDenormCollectionWUnits(state.mdb, x[0]))),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'lessons'),
  };
};

export default connect(mapState, actions)(LessonsContainer);
