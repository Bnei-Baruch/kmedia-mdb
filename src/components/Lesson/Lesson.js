import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header, Item, List, Menu } from 'semantic-ui-react';

import { isEmpty } from '../../helpers/utils';
import * as shapes from '../shapes';
import VideoBox from './VideoBox';
import MediaDownloads from './MediaDownloads';
import myimage from '../../images/image.png';

const Lesson = ({ lesson, language }) => {
  console.log(lesson);
  if (isEmpty(lesson)) {
    return <div />;
  }

  return (
    <div>
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
          <Grid.Column
            style={{
              backgroundColor: 'gray',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
            }}
            width={6}
          >

            <MediaDownloads files={lesson.files} />

            <Header as="h3">Other parts from the same lesson</Header>
            <Item.Group divided link>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 0</Header>
                  <Item.Meta>
                    <small>00:12:37</small>
                  </Item.Meta>
                  <Item.Description>Lesson Preparation</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 1</Header>
                  <Item.Meta>
                    <small>36:10:35</small>
                  </Item.Meta>
                  <Item.Description>Lesson on the topic of &quot;Preparation for the Pesach&quot;, part&nbsp;
                    1</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Content>
                  <Container fluid textAlign="right" as="a">more &raquo;</Container>
                </Item.Content>
              </Item>
            </Item.Group>
            <Header as="h3">Other parts from the same lesson</Header>
            <Item.Group divided link>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 0</Header>
                  <Item.Meta>
                    <small>00:12:37</small>
                  </Item.Meta>
                  <Item.Description>Lesson Preparation</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 1</Header>
                  <Item.Meta>
                    <small>36:10:35</small>
                  </Item.Meta>
                  <Item.Description>Lesson on the topic of &quot;Preparation for the Pesach&quot, part&nbsp;
                    1</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Content>
                  <Container fluid textAlign="right" as="a">more &raquo;</Container>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

Lesson.propTypes = {
  language: PropTypes.string.isRequired,
  lesson: shapes.LessonPart,
};

Lesson.defaultProps = {
  lesson: null
};

export default Lesson;
