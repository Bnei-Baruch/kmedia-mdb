import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Grid, Menu } from 'semantic-ui-react';
import * as shapes from '../../shapes';

class FullEventPlaylist extends Component {

  static propTypes = {
    collection: shapes.EventCollection.isRequired,
    activePart: PropTypes.number,
    onItemClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    activePart: 0
  };

  handleLessonPartClick = (e, data) => {
    this.props.onItemClick(e, data);
  };

  render() {
    const { collection, activePart } = this.props;

    const titles = collection.content_units.map((cu) => {
      const { name, duration } = cu;
      const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
      return `${name} - ${durationDisplay}`;
    });

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Menu vertical fluid size="small">
              {
                collection.content_units.map((part, index) => (
                  <Menu.Item
                    key={part.id}
                    name={`${index}`}
                    content={titles[index]}
                    active={index === activePart}
                    onClick={this.handleLessonPartClick}
                  />
                ))
              }
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default FullEventPlaylist;
