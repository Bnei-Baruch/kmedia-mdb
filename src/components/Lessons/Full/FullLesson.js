import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { Grid } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import FullVideoBox from './FullVideoBox';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
  };

  static defaultProps = {
    fullLesson: null
  };

  render() {
    const { fullLesson } = this.props;

    if (isEmpty(fullLesson)) {
      return <div />;
    }

    return (
      <Grid.Column width={16}>
        <Grid>
          <FullVideoBox {...this.props} />
        </Grid>
      </Grid.Column>
    );
  }
}

export default FullLesson;
