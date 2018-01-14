import React, { Component } from 'react';
import moment from 'moment/moment';
import { Header, Image, Menu } from 'semantic-ui-react';

import { DATE_FORMAT, NO_NAME } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import { formatDuration } from '../../../helpers/utils';
import PlaylistCollection from '../../Pages/PlaylistCollection/Container';
import PlaylistWidget from '../../Pages/PlaylistCollection/widgets/Playlist/Playlist';
import logo from '../../../images/event_logo.png';

class MyPlaylistWidget extends PlaylistWidget {

  renderHeader() {
    const { name, start_date, end_date } = this.props.playlist.collection;

    return (
      <Header inverted as="h2">
        <Image circular src={logo} floated='left' />{name}
        <Header.Subheader>
          {fromToLocalized(moment.utc(start_date, DATE_FORMAT), moment.utc(end_date, DATE_FORMAT))}
        </Header.Subheader>
      </Header>
    );
  }

  renderPlaylistSection(section, items, offset) {
    const { t, selected } = this.props;

    return (
      <div key={section} className='avbox__playlist-view-section'>
        <Header inverted as="h3">
          {t(`events.collection.playlist.${section}`)}&nbsp;&nbsp;
          <small>{items.length} {t(`pages.collection.items.event`)}</small>
        </Header>
        <Menu vertical fluid size="small">
          {
            items.map((item, index) => {
                const { unit } = item;

                let prefix = '';
                switch (section) {
                case 'preparation':
                case 'after_parties':
                  prefix = t('values.date', { date: new Date(unit.film_date) });
                  break;
                default:
                  break;
                }

                return (
                  <Menu.Item
                    key={unit.id}
                    name={`${offset + index}`}
                    active={(offset + index) === selected}
                    onClick={this.handleItemClick}
                  >
                    {
                      section === 'preparation' || section === 'after_parties' ?
                        <strong>{t('values.date', { date: new Date(unit.film_date) })} &nbsp;</strong> :
                        null
                    }
                    {unit.name || NO_NAME} - {formatDuration(unit.duration)}
                  </Menu.Item>
                );
              }
            )
          }
        </Menu>
      </div>
    );
  }

  renderContents() {
    const { items, groups } = this.props.playlist;

    return (
      <div className='avbox__playlist-view'>
        {
          ['preparation', 'lessons', 'other_parts', 'after_parties']
            .map(x => {
              const offsets = groups[x];
              if (!offsets) {
                return null;
              }

              const [offset, len] = offsets;
              return this.renderPlaylistSection(x, items.slice(offset, offset + len), offset);
            })
        }
      </div>
    );
  }
}

class EventCollection extends Component {
  render() {
    return <PlaylistCollection PlaylistComponent={MyPlaylistWidget} />;
  }
}

export default EventCollection;
