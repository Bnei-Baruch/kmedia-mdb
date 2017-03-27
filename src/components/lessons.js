import React  from 'react';
import { Segment, Menu, Header, Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Routes from './router'
import MenuItems from './menu';
import { FetchCollections, LESSONS } from './fetch';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page     : 1,
      page_size: 10,
      language : 'ru',
      lessons  : []
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleDataFetch = (total, lessons) => {
    this.setState({ total, lessons })
  }

  componentDidMount() {
    FetchCollections({
      content_type: LESSONS,
      language    : this.state.language,
      page        : this.state.page,
      page_size   : this.state.page_size
    }, this.handleDataFetch);
  }

  render() {
    const activeItem = this.state.activeItem;

    return (
      <Grid columns='equal' className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple routes={Routes} />
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header as="h3">Results ##1 - ##30 of {this.state.total}</Header>
                  <Menu secondary pointing color="violet" className="index-filters">
                    <Menu.Header className="item">Filter by:</Menu.Header>
                    <Menu.Item name="date-filter" active={activeItem === 'date-filter'} onClick={this.handleItemClick}>Date</Menu.Item>
                    <Menu.Item name="sources-filter" active={activeItem === 'sources-filter'} onClick={this.handleItemClick}>Sources</Menu.Item>
                    <Menu.Item name="topic-filter" active={activeItem === 'topic-filter'} onClick={this.handleItemClick}>Topic</Menu.Item>
                  </Menu>
                  {
                    activeItem === 'date-filter' ? (
                      <Segment basic attached="bottom" className="tab active">First</Segment>
                    ) : activeItem === 'sources-filter' ? (
                      <Segment basic attached="bottom" className="tab active">Second</Segment>
                    ) : (
                      <Segment basic attached="bottom" className="tab active">Third</Segment>
                    )
                  }
                  <Segment>
                    <Lessons lessons={this.state.lessons} />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const Lessons = (props) => {
  const lessons = props.lessons.map((collection) => {
    const lesson = collection._source;
    const units  = lesson.content_units.map((unit) => (
      <Container as="div" key={`u-${unit.mdb_uid}`}><Link to={`/lessons/${unit.mdb_uid}`}>{unit.names['ru']}<br />{unit.descriptions['ru']}
      </Link></Container>
    ));

    return (
      <Grid.Row key={`l-${lesson.mdb_uid}`} stretched verticalAlign="top">
        <Grid.Column width={2}><a><b>{lesson.film_date}</b></a></Grid.Column>
        <Grid.Column width={14}>
          <Grid.Column>
            <a><b>##Morning Lesson</b></a>
            {units}
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
    )
  });

  return (<Grid columns={2} divided="vertically">{lessons}</Grid>);
}

export default LessonsIndex;
