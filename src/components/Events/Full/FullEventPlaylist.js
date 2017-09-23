import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Header, Grid, Menu } from 'semantic-ui-react';
import * as shapes from '../../shapes';

class FullEventPlaylist extends Component {

  static propTypes = {
    collection: shapes.EventCollection.isRequired,
    t: PropTypes.func.isRequired,
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
    const { t, collection, activePart } = this.props;

    const titles = collection.content_units.map((cu) => {
      const { name, duration } = cu;
      const ccuName            = collection.ccuNames[cu.id];
      const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
      return `${ccuName} - ${name} - ${durationDisplay}`;
    });

    return (
      <div>
        <Header
          as="h3"
          content={`${t(`constants.content-types.${collection.content_type}`)} - ${(activePart + 1)}/${collection.content_units.length}`}
          subheader={t('values.date', { date: new Date(collection.start_date) })}
        />
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
      </div>
    );
  }
}

export default FullEventPlaylist;
