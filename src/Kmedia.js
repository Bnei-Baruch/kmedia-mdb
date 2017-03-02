import React, { Component } from 'react';
import { Sidebar, Segment, Menu, Header, Icon, Container, Grid, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import 'semantic-ui-css/semantic.css';
import './Kmedia.css';

class SidebarLeftPush extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} animation="push" visible={this.state.visible} pointing vertical>
          <Menu.Item as={Link} to="/home" active color="violet"> Daily Lessons </Menu.Item>
          <Menu.Item as={Link} to="/home"> TV & Video Programs </Menu.Item>
          <Menu.Item as={Link} to="/home"> Lectures & Lessons </Menu.Item>
          <Menu.Item as={Link} to="/home"> Sources </Menu.Item>
          <Menu.Item as={Link} to="/home"> Events </Menu.Item>
          <Menu.Item as={Link} to="/home"> Books </Menu.Item>
          <Menu.Item as={Link} to="/home"> Topics </Menu.Item>
          <Menu.Item as={Link} to="/home"> Publications </Menu.Item>
          <Menu.Item as={Link} to="/home"> Photos </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <TopFixedMenu title="Daily Lessons" toggleVisibility={this.toggleVisibility}/>
          <div className="pusher">
            {this.props.children}
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

const TopFixedMenu = ({ title, toggleVisibility }) => (
  <Menu fixed="top">
    <Menu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
      <Icon name="sidebar" style={{ padding: 0 }}/>
    </Menu.Item>
    <Menu.Item header>
      <Header as="h4" className="main-title" style={{ marginBottom: 0 }}>Kabbalah Media</Header>
      <small>&nbsp;- {title}</small>
    </Menu.Item>
    <Menu.Item as={Link} to="/home"> Features </Menu.Item>
    <Menu.Item as={Link} to="/home"> Testimonials </Menu.Item>
    <Menu.Item as={Link} to="/home"> Sign-in </Menu.Item>
  </Menu>
);

const Footer = () => (
  <Segment inverted vertical color="black">
    <Container as="p">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque beatae deleniti
      dignissimos dolorem exercitationem expedita odio quasi unde. Atque, blanditiis deserunt doloribus
      molestias quisquam sequi temporibus! Dolorem ea eligendi hic illum modi pariatur placeat possimus repellat
      tempora tempore. Aliquid at atque aut beatae consectetur corporis cum delectus dolore eaque eligendi enim
      ex explicabo fugiat id, impedit incidunt inventore ipsam, ipsum iste itaque labore minima nemo odio, optio
      quia tempora vitae? Eum ex quidem tenetur. A atque excepturi hic iste? Adipisci culpa, cum dignissimos
      fugit laboriosam laudantium libero magnam officia omnis quisquam voluptatibus voluptatum. Cumque doloribus
      error, nostrum quos soluta veritatis?</Container>
  </Segment>
);

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: 'date-filter' };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const activeItem = this.state.activeItem;

    return (
      <Grid columns='equal' className="main-content">
        <Grid.Row stretched>
          <Grid.Column width={3} only="computer">
            <Menu vertical fluid pointing>
              <Menu.Item as={Link} to="/home" active color="violet"> Daily Lessons </Menu.Item>
              <Menu.Item as={Link} to="/home"> TV & Video Programs </Menu.Item>
              <Menu.Item as={Link} to="/home"> Lectures & Lessons </Menu.Item>
              <Menu.Item as={Link} to="/home"> Sources </Menu.Item>
              <Menu.Item as={Link} to="/home"> Events </Menu.Item>
              <Menu.Item as={Link} to="/home"> Books </Menu.Item>
              <Menu.Item as={Link} to="/home"> Topics </Menu.Item>
              <Menu.Item as={Link} to="/home"> Publications </Menu.Item>
              <Menu.Item as={Link} to="/home"> Photos </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header as="h3">Results 1 - 30 of 2190</Header>
                  <Menu secondary pointing color="violet" className="index-filters">
                    <Menu.Header className="item">Filter by:</Menu.Header>
                    <Menu.Item name="date-filter" active={activeItem === "date-filter"} onClick={this.handleItemClick}>Date</Menu.Item>
                    <Menu.Item name="sources-filter" active={activeItem === "sources-filter"} onClick={this.handleItemClick}>Sources</Menu.Item>
                    <Menu.Item name="topic-filter" active={activeItem === "topic-filter"} onClick={this.handleItemClick}>Topic</Menu.Item>
                  </Menu>
                  {
                    activeItem === "date-filter" ? (
                        <Segment basic attached="bottom" className="tab active">First</Segment>
                      ) : activeItem === "sources-filter" ? (
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
    )
  }
}

const Kmedia = () => (
  <SidebarLeftPush>
    <Content/>
    <Footer/>
  </SidebarLeftPush>
);

export default Kmedia;
