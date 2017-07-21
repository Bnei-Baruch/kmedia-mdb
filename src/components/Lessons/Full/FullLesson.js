import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'moment-duration-format';
import { Grid } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import FullVideoBox from './FullVideoBox';
import Info from '../Part/Info';
import Materials from '../Part/Materials';
import MediaDownloads from '../Part/MediaDownloads';
import { actions } from '../../../redux/modules/lessons';
import { selectors as mdb } from '../../../redux/modules/mdb';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    lessonParts: PropTypes.arrayOf(shapes.LessonPart),
  };

  static defaultProps = {
    fullLesson: null,
    lessonParts: [],
  };

  state = {
    activePartIndex: 0,
  };

  onActivePartIndexChange = (activePartIndex) => {
    this.setState({ activePartIndex });
  }

  render() {
    const { fullLesson, lessonParts } = this.props;
    const { activePartIndex } = this.state;

    if (isEmpty(fullLesson)) {
      return <div />;
    }

    return (
      <Grid.Column width={16}>
        <Grid>
          <FullVideoBox activePartIndex={activePartIndex}
                        onActivePartIndexChange={this.onActivePartIndexChange}
                        {...this.props} />
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Info {...this.props} lesson={lessonParts[activePartIndex]} />
              <Materials {...this.props}/>
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads {...this.props} lesson={lessonParts[activePartIndex]} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

function connectLessonParts(state, props) {
  if (props.fullLesson) {
    return props.fullLesson.content_units.map(cu => {
      const u = mdb.getUnitById(state.mdb)(cu.id);
      if (!u || !u.files) {
        props.fetchLessonPart(cu.id);
      }
      return u;
    });
  } else {
    return [];
  }
}

export default connect(
  (state, ownProps) => ({
    lessonParts: connectLessonParts(state, ownProps)
  }),
  actions
)(FullLesson);
