import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Menu } from 'semantic-ui-react';

import { isEmpty } from '../../helpers/utils';
import * as shapes from '../shapes';
import VideoBox from './VideoBox';
import MediaDownloads from './MediaDownloads';

const LessonPart = ({ lesson, language }) => {
  if (isEmpty(lesson)) {
    return <div />;
  }

  return (
    <Grid.Column width={16}>
      <Grid>
        <VideoBox files={lesson.files} language={language} />
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Header as="h3">
              <span className="text grey">{lesson.film_date}</span><br />
              {lesson.name}
            </Header>
            <List style={{
              backgroundColor: 'gray',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
            }}
            >
              <List.Item><b>Topics:</b> <a href="">From Lo Lishma to Lishma</a>, <a href="">Work in
                group</a></List.Item>
              <List.Item><b>Sources:</b> <a href=""> Shamati - There is None Else Beside Him</a>, <a href="">Shamati -
                Divinity in Exile</a></List.Item>
              <List.Item><b>Related to Event:</b> <a href="">World Israel Congress 2016</a></List.Item>
            </List>
            <Menu
              secondary
              pointing
              color="blue"
              className="index-filters"
              style={{
                backgroundColor: 'gray',
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
              }}
            >
              <Menu.Item name="item-summary">Summary</Menu.Item>
              <Menu.Item name="item-transcription">Transcription</Menu.Item>
              <Menu.Item name="item-sources">Sources</Menu.Item>
              <Menu.Item name="item-sketches">Sketches</Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={6}>
            <MediaDownloads files={lesson.files} language={language} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Grid.Column>
  );
};

LessonPart.propTypes = {
  language: PropTypes.string.isRequired,
  lesson: shapes.LessonPart,
};

LessonPart.defaultProps = {
  lesson: null
};

export default LessonPart;
