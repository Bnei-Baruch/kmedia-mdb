import React, { Component } from 'react';
import { Grid, Header, Menu, Icon, Button, Dropdown, Divider, Container, List } from 'semantic-ui-react';
import AVPlayer from '../Lesson/AVPlayer';
class Design extends Component {

  render() {
    return (
      <Grid.Column width={16}>
        {/*<Header size='large' color='pink' inverted>video collection collapsed (๏㉨๏)</Header>*/}

        <div className='collapsed_video_container'>
        	<Grid >
            <Grid.Row>
              <Grid.Column width='3'>
                <div className='video_player'>
                  <div className='video_placeholder' />
                </div>
              </Grid.Column>
                <Grid.Column width='8'>
                  <Grid><Grid.Row><Grid.Column>
                  <Header as="h5">
                    2016-10-26<br/>Lesson on the topic of “From Lo Lishma to Lishma” (not for Her Name for Her Name)
                  </Header>
                  { /*<List>
                    <List.Item><b>Topics:</b> <a href=''>From Lo Lishma to Lishma</a>, <a href=''>Work in group</a></List.Item>
                    <List.Item><b>Sources:</b> <a href=''> Shamati - There is None Else Beside Him</a>, <a href=''>Shamati - Divinity in Exile</a></List.Item>
                    <List.Item><b>Related to Event:</b> <a href=''>World Israel Congress 2016</a></List.Item>
                  </List>  */ }
                  </Grid.Column></Grid.Row></Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excep velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
                <Menu.Item>1 - Lesson preparation - 00:12:02</Menu.Item>
                <Menu.Item active>2 - Lesson on the topic of "Brit (Union)" - 01:29:00</Menu.Item>
                <Menu.Item>3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54</Menu.Item>
                <Menu.Item>4 - Baal HaSulam, "The Giving of the Torah", item 6 - 00:43:41</Menu.Item>
              </Menu>
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
