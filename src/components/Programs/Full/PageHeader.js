import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { translate } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import {assetUrl} from '../../../helpers/Api';
import * as shapes from '../../shapes';
import FallbackImage from '../../shared/FallbackImage';

class PageHeader extends PureComponent {
  static propTypes = {
    fullProgram: shapes.ProgramCollection,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
  };

  render() {
    const { fullProgram, t } = this.props;

    return (
      <div className="section-header">
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <FallbackImage
                  fluid
                  shape="rounded"
                  src={assetUrl(`logos/collections/${fullProgram.id}.png`)}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as="h1">
                  <Header.Content>
                    {fullProgram.name}
                    <Header.Subheader>
                      {fullProgram.content_units.length}&nbsp;{t('programs.full.episodes')}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <p>{fullProgram.description}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(PageHeader);


