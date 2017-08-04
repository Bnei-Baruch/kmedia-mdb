import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Flag, Grid, Header, Icon, Menu } from 'semantic-ui-react';

import { LANGUAGES } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/settings';


class Footer extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };


  render() {
    const { t }             = this.props;
    

    return (
      <div className="layout__footer">
        <Grid padded   inverted>
          <Grid.Row color='black'>
            <Grid.Column>
              <Grid columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <Header inverted as="h3">
                      {t('nav.top.header')}
                      <br/>
                      <small className="text grey">
                      Copyright © 2003-2017
                      <br/>
                      Bnei Baruch – Kabbalah L’Am Association, All rights reserved
                      </small>
                    </Header>
                    

                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Study Materials
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.lessons')}/>
                      <Menu.Item name={t('nav.sidebar.lectures')}/>
                      <Menu.Item name={t('nav.sidebar.sources')}/>
                      <Menu.Item name={t('nav.sidebar.books')}/>
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Topics
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name='Work in the group'/>
                      <Menu.Item name='Life according to kabbalah'/>
                      <Menu.Item name='Dissemination'/>
                      <Menu.Item name='Weekly Torah portion'/>
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Events
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name='World congresses'/>
                      <Menu.Item name='Unity day'/>
                      <Menu.Item name='Assembly of friends'/>
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Media
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.tv_shows')}/>
                      <Menu.Item name={t('nav.sidebar.publications')}/>
                      <Menu.Item name={t('nav.sidebar.photos')}/>
                      <Menu.Item name={t('nav.sidebar.music')}/>
                    </Menu>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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

export default connect(mapState, mapDispatch)(translate()(Footer));
