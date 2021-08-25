import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Header, Icon, Table } from 'semantic-ui-react';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { canonicalLink } from '../../../../helpers/links';
import { imageByUnit } from '../../../../helpers/utils';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import { ReactComponent as PlaylistPlayIcon } from '../../../../images/icons/playlist_play_black_24dp.svg';

export const PlaylistItem = ({ item }) => {
  const unit = useSelector(state => mdb.getDenormContentUnit(state.mdb, item.playlist_items?.[0]?.content_unit_uid)) || {};

  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  return (
    <Card raised link href={`/personal/${MY_NAMESPACE_PLAYLISTS}/${item.id}`}>
      <div className="my_playlist_item">
        <Table className="over_layer">
          <Table.Row>
            <Table.Cell verticalAlign="middle" textAlign="center">
              <h2>{item.count || 0}</h2>
              <Icon name="list" size="big" />
            </Table.Cell>
          </Table.Row>
        </Table>
        <UnitLogo unitId={unit.id} fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?url=http%3A%2F%2Flocalhost%2Fassets%2Fapi%2Fthumbnail%2FEvPTLpdf&width=520&stripmeta=true'} />
      </div>
      <Card.Content>
        <Header size="medium" className="no-margin-top">
          {item.name}
        </Header>
      </Card.Content>
    </Card>
  );
};
