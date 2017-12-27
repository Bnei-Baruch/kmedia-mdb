import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Menu } from 'semantic-ui-react';

import { formatDuration } from '../../../helpers/utils';
import * as shapes from '../../shapes';

class FullLessonPlaylist extends Component {

  static propTypes = {
    collection: shapes.LessonCollection.isRequired,
    t: PropTypes.func.isRequired,
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
    const { t, collection, activePart } = this.props;

    const titles = collection.content_units.map((cu) => {
      const { name, duration } = cu;
      const ccuName            = collection.ccuNames[cu.id];
      const durationDisplay    = formatDuration(duration);
      return `${ccuName} - ${name} - ${durationDisplay}`;
    });

    return (
      <div className='avbox__playlist-wrapper'>
        <Header
          inverted
          as="h1"
          content={`${t(`constants.content-types.${collection.content_type}`)} - ${(activePart + 1)}/${collection.content_units.length}`}
          subheader={t('values.date', { date: new Date(collection.film_date) })}
        />
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

export default FullLessonPlaylist;
