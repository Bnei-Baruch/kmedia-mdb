import React from 'react';
import { Grid } from 'semantic-ui-react';

import { isEmpty } from '../../helpers/utils';
import * as shapes from '../shapes';
import LessonInfo from './LessonInfo';
import LessonMaterials from './LessonMaterials';
import VideoBox from './VideoBox';
import MediaDownloads from './MediaDownloads';

const Lesson = (props) => {
  if (isEmpty(props.lesson)) {
    return <div />;
  }

  return (
    <Grid.Column width={16}>
      <Grid>
        <VideoBox {...props} />
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <LessonInfo {...props} />
            <LessonMaterials {...props} />
          </Grid.Column>
          <Grid.Column width={6}>
            <MediaDownloads {...props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Grid.Column>
  );
};

Lesson.propTypes = {
  lesson: shapes.LessonPart,
};

Lesson.defaultProps = {
  lesson: null
};

export default Lesson;
