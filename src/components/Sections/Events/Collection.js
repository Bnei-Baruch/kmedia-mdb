import React, { Component } from 'react';
import moment from 'moment/moment';
import { Header, Image } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import PlaylistCollection from '../../pages/PlaylistCollection/Container';
import PlaylistWidget from '../../pages/PlaylistCollection/widgets/Playlist/Playlist';
import logo from '../../../images/event_logo.png';

class MyPlaylistWidget extends PlaylistWidget {

  renderHeader() {
    const { name, start_date, end_date } = this.props.collection;

    return (
      <Header inverted as="h2">
        <Image circular src={logo} floated='left' />{name}
        <Header.Subheader>
          {fromToLocalized(moment.utc(start_date, DATE_FORMAT), moment.utc(end_date, DATE_FORMAT))}
        </Header.Subheader>
      </Header>
    );
  }
}

class EventCollection extends Component {
  render() {
    return <PlaylistCollection PlaylistComponent={MyPlaylistWidget} />;
  }
}

export default EventCollection;
