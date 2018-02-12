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
              <Header inverted as="h3">
                {t('nav.top.header')}
                <br />
                <small className="text grey">
                  {t('nav.footer.copyright', { year })} {t('nav.footer.rights')}
                </small>
              </Header>
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
