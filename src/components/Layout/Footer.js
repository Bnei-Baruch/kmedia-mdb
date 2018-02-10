import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Grid, Header } from 'semantic-ui-react';
import { selectors as tags } from '../../redux/modules/tags';

const Footer = (props) => {
  const { t } = props;
  const year  = new Date().getFullYear();

  return (
    <div className="layout__footer">
      <Container>
        <Grid padded inverted>
          <Grid.Row>
            <Grid.Column>
              {/* <Grid columns="equal"> */}
                {/* <Grid.Row> */}
                  {/* <Grid.Column> */}
                    <Header inverted as="h5">
                      {t('nav.top.header')}
                      <br />
                      <small className="text grey">
                        {t('nav.footer.copyright', { year })} {t('nav.footer.rights')}
                      </small>
                    </Header>
                  {/* </Grid.Column> */}
                  {/* <Grid.Column>
                    <Header inverted as="h3" content={t('nav.footer.study')} />
                    <Menu text vertical inverted>
                      <Menu.Item content={t('nav.sidebar.lessons')} as={Link} to="/lessons" />
                      <Menu.Item content={t('nav.sidebar.lectures')} as={Link} to="/lectures" />
                      <Menu.Item content={t('nav.sidebar.sources')} as={Link} to="/sources" />
                      <Menu.Item content={t('nav.sidebar.books')} as={Link} to="/books" />
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3" content={t('nav.footer.topics')} />
                    <Menu text vertical inverted>
                      {renderTopics()}
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3" content={t('nav.footer.events')} />
                    <Menu text vertical inverted>
                      {renderEvents()}
                    </Menu>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h3" content={t('nav.footer.media')} />
                    <Menu text vertical inverted>
                      <Menu.Item content={t('nav.sidebar.programs')} as={Link} to="/programs" />
                      <Menu.Item content={t('nav.sidebar.publications')} as={Link} to="/publications" />
                      <Menu.Item content={t('nav.sidebar.photos')} as={Link} to="/photos" />
                    </Menu>
                  </Grid.Column> */}
                {/* </Grid.Row> */}
              {/* </Grid> */}

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
  tagById: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    tagById: tags.getTagById(state.tags),
  }))(Footer);
