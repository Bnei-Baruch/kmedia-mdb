import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, Header, Menu } from 'semantic-ui-react';

class Footer extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    const year  = new Date().getFullYear();

    return (
      <div className="layout__footer">
        <Grid padded inverted>
          <Grid.Row color="black">
            <Grid.Column>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <Header inverted as="h3">
                      {t('nav.top.header')}
                      <br />
                      <small className="text grey">
                        {t('nav.footer.copyright', { year })}
                        <br />
                        {t('nav.footer.rights')}
                      </small>
                    </Header>


                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Study Materials
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.lessons')} />
                      <Menu.Item name={t('nav.sidebar.lectures')} />
                      <Menu.Item name={t('nav.sidebar.sources')} />
                      <Menu.Item name={t('nav.sidebar.books')} />
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Topics
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name="Work in the group" />
                      <Menu.Item name="Life according to kabbalah" />
                      <Menu.Item name="Dissemination" />
                      <Menu.Item name="Weekly Torah portion" />
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Events
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name="World congresses" />
                      <Menu.Item name="Unity day" />
                      <Menu.Item name="Assembly of friends" />
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Media
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.tv_shows')} />
                      <Menu.Item name={t('nav.sidebar.publications')} />
                      <Menu.Item name={t('nav.sidebar.photos')} />
                      <Menu.Item name={t('nav.sidebar.music')} />
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

export default translate()(Footer);
