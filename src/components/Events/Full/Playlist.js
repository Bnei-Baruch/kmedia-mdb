import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Header, Image, Menu } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import { formatDuration } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import placeholder from '../../shared/placeholder.png';

class FullEventPlaylist extends Component {

  static propTypes = {
    collection: shapes.EventCollection.isRequired,
    activePart: PropTypes.number,
    onItemClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    activePart: 0
  };

  handleItemClick = (e, data) => {
    this.props.onItemClick(e, data);
  };

  render() {
    const { collection, activePart }     = this.props;
    const { name, start_date, end_date } = collection;

    const titles = collection.content_units.map((cu) => {
      const { name, duration } = cu;
      const durationDisplay    = formatDuration(duration);
      return `${name} - ${durationDisplay}`;
    });

    return (
      <div className='avbox__playlist-wrapper'>
        <Header inverted as="h1">
          <Image shape="circular" src={placeholder} />
          <Header.Content>
            {name}
            <Header.Subheader>
              {fromToLocalized(moment.utc(start_date, DATE_FORMAT), moment.utc(end_date, DATE_FORMAT))}
            </Header.Subheader>
          </Header.Content>
        </Header>
        <div className='avbox__playlist-view'>
          <Menu vertical fluid size="small">
            {
              collection.content_units.map((part, index) => (
                <Menu.Item
                  key={part.id}
                  name={`${index}`}
                  content={titles[index]}
                  active={index === activePart}
                  onClick={this.handleItemClick}
                />
              ))
            }
          </Menu>
        </div>
      </div>
    );
  }
}

export default FullEventPlaylist;
