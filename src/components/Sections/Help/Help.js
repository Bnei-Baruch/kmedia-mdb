import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Container, Card, Divider } from 'semantic-ui-react';

import { LANG_HEBREW, LANG_RUSSIAN, LANG_UKRAINIAN } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import SectionHeader from '../../shared/SectionHeader';

class ProjectStatus extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired
  };

  getCard = () => (
    <Card fluid>
      <Card.Content>
        <div>
          <video
            controls
            playsInline
            preload="metadata"
            type="vidoe/mp4"
            src="https://cdn.kabbalahmedia.info/YPXVVaYB.mp4"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </Card.Content>
      <Card.Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac condimentum tellus. Nunc efficitur purus
        vitae elit efficitur, sed lacinia augue egestas. Suspendisse dictum odio leo, vel euismod lectus ullamcorper
        quis. Duis a est sed dolor euismod faucibus quis sed ipsum. Duis sit amet lectus scelerisque, consectetur ante
        eu, mollis elit.

        {Math.random() > 0.5 ? '' : 'vitae elit efficitur, sed lacinia augue egestas. Suspendisse dictum odio leo, vel euismod lectus ullamcorper'}
      </Card.Content>
    </Card>
  );

  render() {
    const { language } = this.props;

    return (
      <div>
        <SectionHeader section="help" />
        <Divider hidden />
        <Container>
          {/*
          <Card.Group centered itemsPerRow={3}>
            {card}
            {card}
            {card}
            {card}
            {card}
          </Card.Group>
          */
          }
          <Grid stackable columns={3}>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
            <Grid.Column>
              {this.getCard()}
            </Grid.Column>
          </Grid>
        </Container>
        <Divider hidden />
      </div>
    );
  }
}

const mapState = state => ({
  language: settings.getLanguage(state.settings),
});

export default connect(mapState)(ProjectStatus);
