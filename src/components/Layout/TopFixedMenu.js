import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Flag, Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { LANGUAGES } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/settings';

class TopFixedMenu extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    toggleVisibility: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
  };

  handleChangeLanguage = (e) => {
    const flag     = e.target.getAttribute('class').split(' ')[0];
    const language = Array.from(Object.values(LANGUAGES)).find(x => x.flag === flag).value;
    if (this.props.language !== language) {
      this.props.setLanguage(language);
    }
  };

  render() {
    const { title, toggleVisibility } = this.props;
    return (
      <Menu fixed="top" inverted color="blue">
        <Container>
          <Menu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
            <Icon name="sidebar" style={{ padding: 0 }} />
          </Menu.Item>
          <Menu.Item header>
            <h3 className="main-title">
              Kabbalah Media
              <small>&nbsp;- {title}</small>
            </h3>
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
        </Container>
      </Menu>
    );
  }
}

function mapState(state) {
  return {
    language: selectors.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setLanguage: actions.setLanguage }, dispatch);
}

export default connect(mapState, mapDispatch)(TopFixedMenu);
