import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, Header, Menu, Container } from 'semantic-ui-react';

import { EVENT_TYPES, TOPICS_FOR_DISPLAY } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';

const Footer = (props) => {
  const { t } = props;
  const year  = new Date().getFullYear();

  const renderEvents = () => {
    return EVENT_TYPES.map((event, index) => (<Menu.Item
      key={index}
      name={t(`constants.content-types.${event}`)}
      as={Link}
      to={{ pathname: '/events', search: `eventType=${event}` }} />));
  };

  const renderTopics = () => {
    return TOPICS_FOR_DISPLAY.map((topic, index) => (<Menu.Item
      key={index}
      name={t(`constants.content-types.${topic}`)}
      as={Link}
      to={{ pathname: `/topics/${topic}` }} />));
  };

  return (
    <div className="layout__footer">
      <Container>
        <Grid padded inverted>
          <Grid.Row>
            <Grid.Column>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <Header inverted as="h3">
                      {t('nav.top.header')}
                      <br />
                      <small className="text grey">
                        {t('nav.footer.copyright', { year })} {t('nav.footer.rights')}
                      </small>
                    </Header>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Study Materials
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.lessons')} as={Link} to={'/lessons'} />
                      <Menu.Item name={t('nav.sidebar.lectures')} as={Link} to={'/lectures'} />
                      <Menu.Item name={t('nav.sidebar.sources')} as={Link} to={'/sources'} />
                      <Menu.Item name={t('nav.sidebar.books')} as={Link} to={'/books'} />
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Topics
                    </Header>
                    <Menu text vertical inverted>
                      {renderTopics()}
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Kabbalah Events
                    </Header>
                    <Menu text vertical inverted>
                      {renderEvents()}
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3">
                      Media
                    </Header>
                    <Menu text vertical inverted>
                      <Menu.Item name={t('nav.sidebar.programs')} as={Link} to={'/programs'} />
                      <Menu.Item name={t('nav.sidebar.publications')} as={Link} to={'/publications'} />
                      <Menu.Item name={t('nav.sidebar.photos')} as={Link} to={'/photos'} />
                    </Menu>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(Footer);
