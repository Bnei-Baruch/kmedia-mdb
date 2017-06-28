import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Menu } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

import VideoBox from '../Part/VideoBox';
import PartsList from './PartsList/PartsList';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
  };

  static defaultProps = {
    fullLesson: null
  };

  constructor(props) {
    super(props);
    this.state = this.getState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getState(nextProps));
  }

  getState = (props) => {
    const { fullLesson } = props;
    if (!fullLesson || !fullLesson.content_units) {
      return { activeLesson: undefined };
    } else {
      const activeLesson = props.getUnitById(fullLesson.content_units[0].id);
      if (!activeLesson.files) {
        console.log('Fetching lesson part', fullLesson.content_units[0].id);
        props.fetchLessonPart(fullLesson.content_units[0].id);
        return { activeLesson: undefined };
      } else {
        return { activeLesson };
      }
    }
  };

  render() {
    const { fullLesson, language } = this.props;

    console.log('Render full lesson:', language, this.state.activeLesson);

    if (isEmpty(fullLesson)) {
      return <div />;
    }

    return (
      <Grid.Column width={16}>
        <Grid>
          <VideoBox language={language} lesson={this.state.activeLesson} />
        </Grid>
        <Grid>
          <PartsList parts={fullLesson.content_units}  />
        </Grid>
      </Grid.Column>
    );
  }
};

export default FullLesson;
