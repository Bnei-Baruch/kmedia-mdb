import React, { Component } from 'react';
import { Container, Flag, Icon, Menu, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import MenuItems from '../Layout/MenuItems';

class Design2 extends Component {

  render() {
    return (
      <div className='layout'>
      	<div className='layout__header'>
      		<Menu inverted size='huge' borderless color='blue'>
	          <Menu.Item as="a" icon >
	            <Icon name="sidebar" style={{ padding: 0 }} />
	          </Menu.Item>
	          <Menu.Item as={Link} to="/" header>
	            <Header inverted as='h2' >
	              Kabbalah Media
	              <small>&nbsp;- Daily Lessons</small>
	            </Header>
	          </Menu.Item>
	          <Menu.Item as={Link} to="/home"> Features </Menu.Item>
	          <Menu.Item as={Link} to="/home"> Testimonials </Menu.Item>
	          <Menu.Item as={Link} to="/home"> Sign-in </Menu.Item>
	          <Menu.Menu position="right">
	            <Menu.Item>
	              <Flag name="us" onClick={this.handleChangeLanguage} />
	              <Flag name="ru" onClick={this.handleChangeLanguage} />
	              <Flag name="il" onClick={this.handleChangeLanguage} />
	            </Menu.Item>
	          </Menu.Menu>
      		</Menu>
      	</div>
      	<div className='layout__sidebar'>
      		<Menu inverted size='huge' borderless color='yellow'>
	          <Menu.Item as="a" icon >
	            <Icon name="sidebar" style={{ padding: 0 }} />
	          </Menu.Item>
	          <Menu.Item as={Link} to="/" header>
	            <Header inverted as='h2' >
	              Kabbalah Media
	            </Header>
       			</Menu.Item>		          
      		</Menu>
      		<div className='layout__sidebar-menu'>
      			<MenuItems simple />
      		</div>
      	</div>
      	<div className='layout__content'>
      		<div className='layout__footer'></div>
      	</div>
      </div>
    );
  }
}

export default Design2;
