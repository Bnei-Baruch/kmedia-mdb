/* eslint-disable */

import React, { Component } from 'react';
import { Grid, Header, Menu, Icon, Button, Dropdown, Divider, List, Popup, Table, Card, Image, Input } from 'semantic-ui-react';

class Design extends Component {

  render() {
    return (
      <Grid.Column width={16}>
        <Header size='large' color='pink' inverted>TV & Video Programs</Header>
        <Divider/>
      
        <div className='featured-unit'>
          <Header
            as="h2"
            content='Featured Programs'
          />
          <Card.Group itemsPerRow='4' doubling>
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/91/276191_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  A New Life
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Last updated: 30/7/2017
                  </span>
                </Card.Meta>
                <Card.Description>
                  Episode 852 - Jewish Culture: Purity & Impurity, the Spiritual Root
                </Card.Description>
              </Card.Content>
            </Card>
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/86/276186_medium.png' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>            
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/37/269137_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>            
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/21/209721_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>  
          </Card.Group>
        </div>
        <Menu secondary pointing color="blue" className="index-filters" size="large">
          <Menu.Item header>Filter Programs by:</Menu.Item>
          <Menu.Item active>Date</Menu.Item>
          <Menu.Item>Genre / Program</Menu.Item>
          <Menu.Item>Topic</Menu.Item>
          <Menu.Item>
            <Input size='small' icon icon='search' placeholder='Search Programs...' />
          </Menu.Item>
        </Menu>
        {/*<Header size='large' color='pink' inverted>video collection collapsed (๏㉨๏)</Header>*/}

        {/*
        <div className='collapsed_video_container'>
        	<Grid >
            <Grid.Row>
              <Grid.Column width='4'>
                <div className='video_player'>
                  <div className='video_placeholder' />
                </div>
              </Grid.Column>
              <Grid.Column width='10'>

                <Header as="h5">
                  2016-10-26<br/>Lesson on the topic of “From Lo Lishma to Lishma” (not for Her Name for Her Name)
                </Header>
                <List size='mini'>
                  <List.Item><b>Topics:</b> <a href=''>From Lo Lishma to Lishma</a>, <a href=''>Work in group</a></List.Item>
                  <List.Item><b>Sources:</b> <a href=''> Shamati - There is None Else Beside Him</a>, <a href=''>Shamati - Divinity in Exile</a></List.Item>
                  <List.Item><b>Related to Event:</b> <a href=''>World Israel Congress 2016</a></List.Item>
                </List>

              </Grid.Column>
              <Grid.Column width='2'>
                <Popup
                  trigger={<Button size="mini" color="orange" compact fluid>Downloads</Button>}
                  flowing
                  position='bottom center'
                >
                  <Popup.Header>
                    Downloads
                  </Popup.Header>
                  <Popup.Content>
                  <Table basic="very" compact="very">
                    <Table.Body>
                      <Table.Row verticalAlign="top">
                        <Table.Cell>
                          Lesson Video
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button as="a" target="_blank" size="mini" color="orange" compact fluid>
                            MP4
                          </Button>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Button size="mini" color="orange" compact fluid>
                              Copy Link
                            </Button>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row verticalAlign="top">
                        <Table.Cell>
                          Lesson Audio
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button as="a" target="_blank" size="mini" color="orange" compact fluid>
                            MP3
                          </Button>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Button size="mini" color="orange" compact fluid>
                              Copy Link
                            </Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  </Popup.Content>
                </Popup>

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        */}
        
      	<Header size='large' color='pink' inverted>video collection ☼.☼</Header>
        <Grid>
          <Grid.Row className='video_box'>
            <Grid.Column width='10'>
             	<div className='video_player'>
		            <div className='video_placeholder' />
		         	</div>
            </Grid.Column>
            <Grid.Column className='player_panel' width='6' >
              <Grid columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <Button.Group fluid>
                      <Button active color='blue'>Video</Button>
                      <Button>Audio</Button>
                    </Button.Group>
                  </Grid.Column>
                  <Grid.Column>
                    <Dropdown fluid placeholder='Language' search selection options={[
                      { key: 'EN', value: 'EN', text: 'English' },
                      { key: 'HE', value: 'HE', text: 'Hebrew' },
                      { key: 'RU', value: 'RU', text: 'Russian' }
                      ]} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider/>
                <Header as='h3'>
                  <Header.Content>
                    Morning Lesson - 2/4
                    <Header.Subheader>
                      2016-10-26
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              <Menu vertical fluid size='small' color='blue'>
                <Menu.Item as='a'>1 - Lesson preparation - 00:12:02</Menu.Item>
                <Menu.Item as='a' active>2 - Lesson on the topic of "Brit (Union)" - 01:29:00</Menu.Item>
                <Menu.Item as='a' disabled>
                  3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54

                </Menu.Item>
                <Menu.Item as='a'>4 - Baal HaSulam, "The Giving of the Torah", item 6 - 00:43:41</Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Header size='large' color='pink' inverted>tags -^+^-</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div className='filter-tags'>
                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='book' />
                    Baal HaSulam - TES
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>

                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='tag' />
                    Arvut Between the Tens
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>

                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='calendar' />
                    3 Jul 2017 - 3 Jul 2017
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Header size='large' color='pink' inverted>pagination (°ʖ°)</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Menu pagination color='blue'>
                <Menu.Item icon><Icon name='angle double left' /></Menu.Item>
                <Menu.Item icon><Icon name='angle left' /></Menu.Item>
                <Menu.Item icon disabled><Icon name='ellipsis horizontal' /></Menu.Item>
                <Menu.Item name='2' />
                <Menu.Item name='3' />
                <Menu.Item name='4' />
                <Menu.Item name='5' />
                <Menu.Item active name='6' />
                <Menu.Item name='7' />
                <Menu.Item name='8' />
                <Menu.Item name='9' />
                <Menu.Item name='10' />
                <Menu.Item icon disabled><Icon name='ellipsis horizontal' /></Menu.Item>
                <Menu.Item icon><Icon name='angle right' /></Menu.Item>
                <Menu.Item icon><Icon name='angle double right' /></Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

export default Design;
