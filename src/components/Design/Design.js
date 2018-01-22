/* eslint-disable */

import React, { Component } from 'react';
import { Grid, Header, Menu, Icon, Button, Dropdown, Divider, List, Popup, Table, Card, Image, Input, Search, Label, Container, Embed, Segment } from 'semantic-ui-react';
import DailyLessonPlaceholder from '../../images/hp_lesson_temp.png';
import FeaturedPlaceholder from '../../images/hp_featured_temp.jpg';
import DailyLessonsIcon from '../../images/icons/dailylessons.svg';
import ProgramsIcon from '../../images/icons/programs.svg';
import LecturesIcon from '../../images/icons/lectures.svg';
import SourcesIcon from '../../images/icons/sources.svg';
import EventsIcon from '../../images/icons/events.svg';
import PublicationsIcon from '../../images/icons/publications.svg';
// import GridColumn from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
const results ={
    "search": {
      "icon": "search",
      "name": "Search",
      "results": [
        {"title": "tod"}
      ]
    },
    "date": {
      "icon": "calendar",
      "name": "Date",
      "results": [
        {"title": "Today"}
      ]
    },
    "sources": {
      "icon": "book",
      "name": "Sources",
      "results": [
        {"title": "Rabash > Articles > You Stand Today, All of You"}
      ]
    },
    "topics": {
      "icon": "tag",
      "name": "Topics",
      "results": [
        {"title": "Kabbalah today"},
        {"title":"Today and Tomorrow"}
      ]
    }
  }
const categoryRenderer = ({ name, icon }) => <div><Icon name={icon}/>{name}</div>
const resultRenderer = ({ title }) => <div>{title}</div>

class Design extends Component {

  render() {
    return (
      <div>
          <div className='homepage'>
            <Container className='padded'>
              <div className='homepage__header'>
                <Grid centered>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Header as="h1" color="blue" className='homepage__title'>
                        <Header.Content>
                          Explore the wisdom of Kabbalah
                        </Header.Content>
                      </Header>
                    </Grid.Column>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <div className='homepage__search'>
                        <Input fluid action='Search' placeholder='Search...' />
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </Container>
            <div className='homepage__featured'>
              <Container className='padded'>
                <Grid centered>
                  <Grid.Row>
                    <Grid.Column computer={6} tablet={7} mobile={16}>
                      <div className='thumbnail'>
                        <a href='#'>
                          <Image className='thumbnail__image' src={DailyLessonPlaceholder} fluid />
                          <Header as='h2' className='thumbnail__header'>
                            <Header.Content>
                              
                              <Header.Subheader>
                                1/10/2018
                              </Header.Subheader>
                              The Latest Daily Lesson
                            </Header.Content>
                          </Header>
                          <Label color='orange' size='mini'>
                            Daily Lessons
                          </Label>
                        </a>
                      </div>                    
                    </Grid.Column>
                    <Grid.Column computer={6} tablet={7} mobile={16}>
                      <div className='thumbnail'>
                        <a href='#'>
                          <Image className='thumbnail__image' src={FeaturedPlaceholder} fluid />
                          <Header as='h2' className='thumbnail__header'>
                            <Header.Content>
                              <Header.Subheader>
                                February 2018
                              </Header.Subheader>
                              The World Kabbalah Congress
                            </Header.Content>
                          </Header>
                          <Label color='orange' size='mini'>
                            Events
                          </Label>
                        </a>
                      </div> 
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </div>
            <Container className='padded homepage__sections'>            
              <div className='homepage__section homepage__iconsrow'>
                <Grid centered padded='vertically'>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Divider horizontal fitted>Archive Sections</Divider>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Grid doubling columns={6}>
                        <Grid.Row>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={DailyLessonsIcon} /><br/>Daily Lessons</Header></Grid.Column>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={ProgramsIcon} /><br/>Programms</Header></Grid.Column>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={LecturesIcon} /><br/>Lectures</Header></Grid.Column>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={SourcesIcon} /><br/>Sources</Header></Grid.Column>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={EventsIcon} /><br/>Events</Header></Grid.Column>
                          <Grid.Column textAlign='center'><Header size='small' as='a' href=''><Image src={PublicationsIcon} /><br/>Publications</Header></Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              <div className='homepage__section'>
                <Grid centered padded='vertically'>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Divider horizontal fitted>Latest Updates</Divider>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Card.Group itemsPerRow='4' doubling >
                        <Card href='#'>
                          <Image src='https://archive.kbb1.com/assets/api/thumbnail/64RFGZR6' />
                          <Card.Content>
                            <Header size='small'>
                              <small className='text grey'>1/16/2018</small><br/>
                                Baal HaSulam. Introduction to The Book of Zohar
                            </Header>                            
                          </Card.Content>
                          <Card.Content extra>
                            <Label size='small'>Daily Lessons</Label>
                          </Card.Content>
                        </Card>
                        <Card href='#'>
                          <Image src='https://archive.kbb1.com/assets/api/thumbnail/tSmGoUDU' />
                          <Card.Content>                            
                            <Header size='small'>
                              <small className='text grey'>12/24/2017</small><br/>
                              Webinar with Dr. Michael Laitman
                            </Header>
                          </Card.Content>
                          <Card.Content extra>
                            <Label size='small'>Lectures & Lessons</Label>
                          </Card.Content>
                        </Card>            
                        <Card href='#'>
                          <Image src='https://archive.kbb1.com/assets/api/thumbnail/fc3bAksF' />
                          <Card.Content>
                            <Header size='small'>
                              <small className='text grey'>1/16/2018</small><br/>
                              A New Life 949
                            </Header>
                          </Card.Content>
                          <Card.Content extra>
                            <Label size='small'>Programs</Label>
                          </Card.Content>
                        </Card>            
                        <Card href='#'>
                          <Image src='https://archive.kbb1.com/assets/api/thumbnail/JnAbkx0l' />
                          <Card.Content>
                            <Header size='small'>
                              <small className='text grey'>1/16/2018</small><br/>
                              World Convention 2018
                            </Header>
                          </Card.Content>
                          <Card.Content extra>
                            <Label size='small'>Events</Label>
                          </Card.Content>
                        </Card>  
                      </Card.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              <div className='homepage__section'>
                <Grid centered padded='vertically'>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Divider horizontal fitted>Popular Topics</Divider>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={12} tablet={14} mobile={16}>
                      <Grid>
                        <Grid.Row columns={5}  className='homepage-posters'>
                          <Grid.Column >
                            <div className='thumbnail'>
                              <div className='thumbnail__image' style={{backgroundImage:'url(http://www.thefertilebody.com/Content/Images/UploadedImages/a931e8de-3798-4332-8055-ea5b041dc0b0/ShopItemImage/conception.jpg)'}}></div>
                              <a href='#'>
                                <Header as='h3' className='thumbnail__header'>
                                  <Header.Content>
                                    Conception
                                  </Header.Content>
                                </Header>
                              </a>
                            </div> 
                          </Grid.Column>
                            
                          <Grid.Column >
                            <div className='thumbnail'>
                              <div className='thumbnail__image' style={{backgroundImage:'url(https://images-na.ssl-images-amazon.com/images/I/71mpCuqBFaL._SY717_.jpg)'}}></div>
                              <a href='#'>
                                <Header as='h3' className='thumbnail__header'>
                                  <Header.Content>
                                    The role of women in the spiritual system
                                  </Header.Content>
                                </Header>
                              </a>
                            </div> 
                          </Grid.Column>
                          <Grid.Column >
                            <div className='thumbnail'>
                              <div className='thumbnail__image' style={{backgroundImage:'url(https://assets4.bigthink.com/system/idea_thumbnails/53104/size_1024/shutterstock_84089224.jpg?1381781657)'}}></div>
                              <a href='#'>
                                <Header as='h3' className='thumbnail__header'>
                                  <Header.Content>
                                    Parenting &amp; Family
                                  </Header.Content>
                                </Header>
                              </a>
                            </div> 
                          </Grid.Column>
                          <Grid.Column >
                            <div className='thumbnail'>
                              <div className='thumbnail__image' style={{backgroundImage:'url(https://hpba.pl/wp-content/uploads/2015/09/Amazing-Wallpapers206-1020x816.jpg)'}}></div>
                              <a href='#'>
                                <Header as='h3' className='thumbnail__header'>
                                  <Header.Content>
                                    Happiness
                                  </Header.Content>
                                </Header>
                              </a>
                            </div> 
                            
                          </Grid.Column>
                          <Grid.Column >
                            <Image src='/assets/images/wireframe/image.png' />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </Container>
          </div>
        {/*
        <Header size='large' color='pink' inverted>Homepage End</Header>
        <div className='section-header'>
          <Container className='padded'>
            <Grid>
              <Grid.Row>
                <Grid.Column computer={10} tablet={12} mobile={16}>
                  <Header as='h1' color='blue'>
                    <Header.Content>
                      Programs
                      <Header.Subheader>
                        The daily acceptance rate is delivered by Rabbi Dr. Michael Laitman to millions of viewers around the world, every night between 3-6 clock Israel, and describes the spiritual flow that humanity today.
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Divider fitted/>
        <Menu secondary pointing color="blue" className="index-filters" size="large">
          <Container className='padded horizontally'>
              <Menu.Item header>
                Filter Programs by:
              </Menu.Item>
              <Menu.Item active>
                Genre/Program
                <Icon name='dropdown'/>
              </Menu.Item>
              <Menu.Item >
                Topics
                <Icon name='dropdown'/>
              </Menu.Item>
              <Menu.Item > 
                Date
                <Icon name='dropdown'/>
              </Menu.Item>
            </Container>
          </Menu>
        <Container className='padded horizontally'>
          <Segment vertical className="tab active" style={{
            padding: '0'
          }}>
            <div className="filter-steps">
              <div className="filter-steps__column-wrapper">
                <div className="filter-steps__column">
                  <Menu vertical color='blue' size='tiny' fluid>
                    <Menu.Item active>All Programms</Menu.Item>
                    <Menu.Item>Children</Menu.Item>
                    <Menu.Item>Talk Show</Menu.Item>
                    <Menu.Item>Late Night</Menu.Item>
                  </Menu>
                </div>
              </div>
              <div className="filter-steps__column-wrapper">
                <div className="filter-steps__column">
                  <Grid padded className="filter-steps__lists" columns={5}>
                    <Grid.Row stretched>
                      <Grid.Column width={16}>
                        <Header as='h6' color='grey'>Recently Updated</Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Card
                          href='#'
                          header='Between Words'
                          meta='A new parts added: Today'
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Card
                          href='#'
                          header='Between Words'
                          meta='A new parts added: Today'
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Card
                          href='#'
                          header='Between Words'
                          meta='A new parts added: Today'
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Card
                          href='#'
                          header='Between Words'
                          meta='A new parts added: Today'
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Card
                          href='#'
                          header='Between Words'
                          meta='A new parts added: Today'
                        />
                      </Grid.Column>
                      
                    </Grid.Row>
                    <Grid.Row >
                      <Grid.Column width={16}>
                        <Header as='h6' color='grey'>All Programs</Header>
                        
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>#<Divider/></List.Header></List.Item>
                          <List.Item>20 Ideas</List.Item>
                        </List>
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>A<Divider/></List.Header></List.Item>
                          <List.Item>A New Life</List.Item>
                          <List.Item>A New Life. Excerpts</List.Item>
                          <List.Item>A Point in the Heart</List.Item>
                          <List.Item inverted>A song from the source</List.Item>
                          <List.Item>A Song Out of the Sleeve</List.Item>
                          <List.Item>A Spiritual Story with Eran Kurtz</List.Item>
                          <List.Item>A Taste of Light</List.Item>
                          <List.Item>All together</List.Item>
                          <List.Item>Among Friends</List.Item>
                          <List.Item>Ask the Kabbalist</List.Item>
                          <List.Item>Ask the kabbalist</List.Item>
                          <List.Item>At six on 66</List.Item>
                          <List.Item>Audio Program</List.Item>
                        </List>
                      </Grid.Column>
                      <Grid.Column>

                        <List size='tiny'>
                          <List.Item><List.Header>B<Divider/></List.Header></List.Item>
                          <List.Item>Babylon Yesterday and Today</List.Item>
                          <List.Item>Backstage with</List.Item>
                          <List.Item>Basics</List.Item>
                          <List.Item>Behind the Words</List.Item>
                          <List.Item>Between Parents and Children</List.Item>
                          <List.Item>Between Us</List.Item>
                          <List.Item>Between Words</List.Item>
                          <List.Item>Book about Israel</List.Item>
                          <List.Item>Business and the new reality</List.Item>
                          <List.Item>Butterfly Effect</List.Item>
                        </List>
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>C<Divider/></List.Header></List.Item>
                          <List.Item>Child's Play</List.Item>
                          <List.Item>Children's World</List.Item>
                          <List.Item>Closeup</List.Item>
                          <List.Item>Company</List.Item>
                          <List.Item>Connecting for Good</List.Item>
                          <List.Item>Conversations with Kabbalist</List.Item>
                          <List.Item>Crossroads</List.Item>
                        </List>
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>E<Divider/></List.Header></List.Item>
                          <List.Item>Education Issues</List.Item>
                          <List.Item>Essentials of education</List.Item>
                          <List.Item>Experts</List.Item>
                        </List>                      
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>F<Divider/></List.Header></List.Item>
                          <List.Item>Films</List.Item>
                        </List>                      
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>G<Divider/></List.Header></List.Item>
                          <List.Item>Getting ready for the congress</List.Item>
                          <List.Item>Global Village</List.Item>
                          <List.Item>Good environment</List.Item>
                          <List.Item>Good time</List.Item>
                          <List.Item>Great Kabbalists</List.Item>
                        </List>                      
                      </Grid.Column>
                      <Grid.Column>
                        <List size='tiny'>
                          <List.Item><List.Header>H<Divider/></List.Header></List.Item>
                          <List.Item>Hasidism</List.Item>
                          <List.Item>Hot Topic</List.Item>
                          <List.Item>HR Secrets Revealed</List.Item>
                        </List>                      
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  
                  
                </div>
              </div>
            </div>
          </Segment>
          <Segment vertical clearing>
            <Button primary content='Apply' floated="right" />
            <Button content='Cancel' floated="right" />
          </Segment>
        </Container>
      <Grid.Column width={16}>

        <Header size='large' color='pink' inverted>Event Collection</Header>
        <Divider/>
        <Container className='padded'>
          <Menu>
              <Menu.Item header>
                Filter Programs by:
              </Menu.Item>
              <Menu.Item fitted='vertically' active>
                  <div>
                    <small>
                    Genre/Program
                    </small>
                    <br/>
                    All
                  </div>
                  <Icon name='dropdown'/>
              </Menu.Item>
              <Menu.Item fitted='vertically'>
                  <div>
                    <small>
                    Topics
                    </small>
                    <br/>
                    All
                  </div>
                  <Icon name='dropdown'/>
              </Menu.Item>
              <Menu.Item fitted='vertically'>
                  <div>
                    <small>
                    Date
                    </small>
                    <br/>
                    16 Sep 2017 - 22 Sep 2017
                  </div>
                  <Icon name='dropdown'/>
              </Menu.Item>
          </Menu>
        </Container>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
               <Image fluid shape='rounded' src='https://i1.sndcdn.com/artworks-000205720468-8rbpnk-t500x500.jpg' />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h1'>
                <Header.Content>
                  <small className='text grey'>25-27 of August 2017</small>
                  <br/>
                  EUROPE 2.0<br/>THE FUTURE BEGINS NOW
                  <Header.Subheader>
                    Bonn Area, Germany
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p>
                A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life
              </p>
              
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Embed
                active={true}
                aspectRatio="21:9"
                iframe={{
                  allowFullScreen: false,
                  style: {
                    border: 0
                  },
                  frameborder: "0"
                }}
                placeholder='/assets/images/image-16by9.png'
                url='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80860.06794871506!2d7.04726036282409!3d50.703664739362665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bee19f7ccbda49%3A0x86dbf8c6685c9617!2sBonn%2C+Germany!5e0!3m2!1sen!2sil!4v1503539041101'
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Header size='large' color='pink' inverted>Programs Collection</Header>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
               <Image fluid shape='rounded' src='http://www.kab.co.il/images/attachments/91/276191_medium.jpg' />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h1'>
                <Header.Content>
                  A New Life
                  <Header.Subheader>
                    920 Episodes
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p>
                A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Header size='large' color='pink' inverted>TV & Video Programs</Header>
        <Divider/>
      
        <div className='featured-unit'>
          <Header
            as="h2"
            content='Programs'
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
          <Menu.Item className='index-filters__search'>

            <Search  category results={results} size='mini' placeholder='Search Programs...'categoryRenderer={categoryRenderer} resultRenderer={resultRenderer} />
          </Menu.Item>
        </Menu>
        <Header size='large' color='pink' inverted>video collection collapsed (๏㉨๏)</Header>

        
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
                <List size='tiny'>
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
      */}
      </div>
    );
  }
}

export default Design;
