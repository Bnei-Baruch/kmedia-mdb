import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Menu } from 'semantic-ui-react';

import { formatDuration } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import moment from 'moment/moment';
import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, DATE_FORMAT } from '../../../../../helpers/consts';
import { fromToLocalized } from '../../../../../helpers/date';

class PlaylistWidget extends Component {

  static propTypes = {
    collection: shapes.GenericCollection.isRequired,
    selected: PropTypes.number,
    onItemClick: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    selected: 0
  };

  handleItemClick = (e, data) => {
    this.props.onItemClick(e, data);
  };

  renderHeader() {
    const { collection, selected, t } = this.props;

    let content = collection.name;
    if (!content) {
      const ct = collection.content_type === CT_SPECIAL_LESSON ? CT_DAILY_LESSON : collection.content_type;
      content = `${t(`constants.content-types.${ct}`)} - ${(selected + 1)}/${collection.content_units.length}`;
    }

    let subheader = '';
    if (collection.film_date) {
      subheader = t('values.date', { date: new Date(collection.film_date) });
    } else if (collection.start_date && collection.end_date) {
      subheader = fromToLocalized(
        moment.utc(collection.start_date, DATE_FORMAT),
        moment.utc(collection.end_date, DATE_FORMAT))
    }

    return <Header inverted as="h1" content={content} subheader={subheader} />;
  }

  renderContents() {
    const { collection, selected } = this.props;

    return (
      <div className='avbox__playlist-view'>
        <Menu vertical fluid size="small">
          {
            collection.content_units.map((unit, index) => (
              <Menu.Item
                key={unit.id}
                name={`${index}`}
                content={`${unit.name} - ${formatDuration(unit.duration)}`}
                active={index === selected}
                onClick={this.handleItemClick}
              />
            ))
          }
        </Menu>
      </div>
    );
  }

  render() {
    return (
      <div className='avbox__playlist-wrapper'>
        {this.renderHeader()}
        {this.renderContents()}
      </div>
    );
  }
}

export default PlaylistWidget;
