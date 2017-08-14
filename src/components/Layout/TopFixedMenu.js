import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Flag, Icon, Menu } from 'semantic-ui-react';

import { FLAG_TO_LANGUAGE } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/settings';
import Link from '../Language/MultiLanguageLink';

const flags = ['us', 'ru', 'il'];

class TopFixedMenu extends PureComponent {

  static propTypes = {
    language: PropTypes.string.isRequired,
    toggleVisibility: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  // FIXME: remove @deprecated
  // handleChangeLanguage = (e) => {
  //   const flag     = e.target.getAttribute('class').split(' ')[0];
  //   const language = Array.from(Object.values(LANGUAGES)).find(x => x.flag === flag).value;
  //   if (this.props.language !== language) {
  //     this.props.setLanguage(language);
  //   }
  // };

  render() {
    const { toggleVisibility, t } = this.props;

    return (
      <Menu inverted borderless fixed="top" color="blue">
        <Container>
          <Menu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
            <Icon name="sidebar" style={{ padding: 0 }} />
          </Menu.Item>
          <Menu.Item header>
            <h3 className="main-title">
              {t('nav.top.header')}
            </h3>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              {
                flags.map(flag => (
                  <Link language={FLAG_TO_LANGUAGE[flag]} key={flag}>
                    <Flag name={flag} />
                  </Link>
                ))
              }
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

export default connect(mapState, mapDispatch)(translate()(TopFixedMenu));
