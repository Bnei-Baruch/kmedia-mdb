import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Image, Header, Grid, Menu } from 'semantic-ui-react';
import * as shapes from '../../shapes';
import placeholder from './placeholder.png';

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
      <div>
        <Header
          inverted
          as="h1"
        >
          <Image shape='circular' src={placeholder} />
          <Header.Content>
            "All as One" in Georgia
              <Header.Subheader>
                15 - 17 September 2017
              </Header.Subheader>
          </Header.Content>
        </Header>
  
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

      </div>
    );
  }
}

export default FullEventPlaylist;
