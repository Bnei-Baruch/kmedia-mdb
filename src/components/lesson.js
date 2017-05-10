import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Item, Container, Table, Button, Header, Segment, Grid, List, Menu as RMenu } from 'semantic-ui-react';

import MenuRoutes from './router';
import MenuItems from './menu';
import { FetchContentUnit } from './fetch';

import myimage from '../images/image.png';

class LessonView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson    : null,
      language  : 'ru',
      activeItem: ''
    };
  }

  componentDidMount() {
    const { match } = this.props;

    FetchContentUnit(match.params.id, {
      language: this.state.language,
    }, this.handleDataFetch);
  }

  handleDataFetch = (params, lesson) => {
    this.setState({ lesson });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const lesson     = this.state.lesson;
    const activeItem = this.state.activeItem;

    if (lesson === null) {
      return <h3>Loading...</h3>;
    }

    return (
      <Grid columns="equal" className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple routes={MenuRoutes} />
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Lesson lesson={lesson} />
                  <RMenu secondary pointing color="blue" className="index-filters">
                    <RMenu.Item name="item-summary" active={activeItem === 'item-summary'} onClick={this.handleItemClick}>Summary</RMenu.Item>
                    <RMenu.Item name="item-transcription" active={activeItem === 'item-transcription'} onClick={this.handleItemClick}>Transcription</RMenu.Item>
                    <RMenu.Item name="item-sources" active={activeItem === 'item-sources'} onClick={this.handleItemClick}>Sources</RMenu.Item>
                    <RMenu.Item name="item-sketches" active={activeItem === 'item-sketches'} onClick={this.handleItemClick}>Sketches</RMenu.Item>
                  </RMenu>
                  <Filter activeItem={activeItem} />
                </Grid.Column>
                <Grid.Column width={6}>
                  <Downloads files={lesson.files} />
                  <OtherParts />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

LessonView.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params : PropTypes.object,
    path   : PropTypes.string,
    url    : PropTypes.string,
  }).isRequired
};

//  const duration = (source) => {
//    let value     = source;
//    const days    = Math.floor(value / 86400);
//    value %= 86400;
//    const hours   = Math.floor(value / 3600);
//    value %= 3600;
//    const minutes = Math.floor(value / 60);
//    value %= 60;
//
//    return (days ? `${days} d ` : '') + (hours ? `${hours}:` : '00:') + (minutes ? `${minutes}:` : '00') + (value || '00');
//  };

const Filter = (activeItem) => {
  switch (activeItem) {
  case 'date-filter' :
    return <Segment basic attached="bottom" className="tab active">First</Segment>;
  case 'sources-filter' :
    return <Segment basic attached="bottom" className="tab active">Second</Segment>;
  case 'topic-filter' :
    return <Segment basic attached="bottom" className="tab active">Third</Segment>;
  default:
    return null;
  }
};

Filter.propTypes = {
  activeItem: PropTypes.oneOf(['date-filter', 'sources-filter', 'topic-filter', '']).isRequired
};

const Lesson = ({ lesson }) => (
  <Container>
    <Header as="h3"><span className="text grey">{lesson.film_date}</span><br />{lesson.name}</Header>
    <List>
      <List.Item><strong>Topics:</strong><a href="">From Lo Lishma to Lishma</a>, <a href="">Work in
        group</a></List.Item>
      <List.Item><strong>Sources:</strong> <a href=""> Shamati - There is None Else Beside Him</a>,
        <a href="">Shamati - Divinity in Exile</a></List.Item>
      <List.Item><strong>Related to Event:</strong> <a href="">World Israel Congress 2016</a></List.Item>
    </List>
  </Container>
);

Lesson.propTypes = {
  lesson: PropTypes.shape({
    uid        : PropTypes.string,
    description: PropTypes.string
  })
};

Lesson.defaultProps = {
  lesson: null
};

const Downloads = ({ files }) => (
  <Container>
    <Header as="h3">Media Downloads</Header>
    <Table basic="very" compact="very">
      <Table.Body>
        <Table.Row>
          <Table.Cell>Lesson Video</Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>MP4</Button></Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
            Link</Button></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lesson Audio</Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>MP3</Button></Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
            Link</Button></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Source Materials</Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>DOC</Button></Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
            Link</Button></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Transcription Text</Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>DOC</Button></Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
            Link</Button></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Sketches</Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>ZIP</Button></Table.Cell>
          <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
            Link</Button></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Container>
);

const OtherParts = () => (
  <Container>
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
  </Container>
);

Downloads.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  }))
};

Downloads.defaultProps = {
  files: []
};

const File = ({ file }) =>
  <Segment>
    <Header as="h5">{file.name}</Header>
    <div>{file.language}, {file.size} bytes, {file.type}, {file.mimetype}&nbsp;
      <Link to={file.url}><span>Listen</span></Link> <Link to={file.download_url}>Download</Link>
    </div>
  </Segment>
;

File.propTypes = {
  file: PropTypes.shape({
    name        : PropTypes.string,
    language    : PropTypes.string,
    size        : PropTypes.number,
    type        : PropTypes.string,
    mimetype    : PropTypes.string,
    url         : PropTypes.string,
    download_url: PropTypes.string,
  }).isRequired
};

export default LessonView;
