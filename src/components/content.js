import React  from 'react';
import { Segment, Menu, Header, Grid, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import MenuItems from './menu';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: 'date-filter' };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const activeItem = this.state.activeItem;

    return (
      <Grid columns='equal' className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple active="daily_lessons"/>
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header as="h3">Results 1 - 30 of 2190</Header>
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
                  <Table structured className="results_table">
                    <Table.Body>
                      <Table.Row verticalAlign="top">
                        <Table.Cell className="minimized" rowSpan="4"><b>2017-01-22</b></Table.Cell>
                        <Table.Cell><a><b>Morning Lesson</b></a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row verticalAlign="top">
                        <Table.Cell className="minimized" rowSpan="6"><b>2017-01-20</b></Table.Cell>
                        <Table.Cell><a><b>Morning Lesson</b></a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><a>Lorem ipsum dolor sit amet, consectetur.</a></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Content;
