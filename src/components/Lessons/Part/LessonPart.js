import React from 'react';
import { Grid } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Info from './Info';
import Materials from './Materials';
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
            <Info {...props} />
            <Materials {...props} />
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
