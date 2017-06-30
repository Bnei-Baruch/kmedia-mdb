import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Menu } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

import FullVideoBox from './FullVideoBox';

import moment from 'moment';
import 'moment-duration-format';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
  };

  static defaultProps = {
    fullLesson: null
  };

  render() {
    const { fullLesson, language } = this.props;

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
};

export default FullLesson;
