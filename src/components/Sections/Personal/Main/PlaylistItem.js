import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Header, Icon, Table } from 'semantic-ui-react';

import { selectors as mdb } from '../../../../redux/modules/mdb';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { isLanguageRtl } from '../../../../helpers/i18n-utils';
import { canonicalLink } from '../../../../helpers/links';
import { imageByUnit } from '../../../../helpers/utils';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import Link from '../../../Language/MultiLanguageLink';

export const PlaylistItem = ({ item, t, language, asList = false }) => {
  const unit = useSelector(state => mdb.getDenormContentUnit(state.mdb, item.playlist_items?.[0]?.content_unit_uid)) || {};

  const isRtl            = isLanguageRtl(language);
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);
  const href             = `/personal/${MY_NAMESPACE_PLAYLISTS}/${item.id}`;
  const renderAsCard     = () => (
    <Card as={Link} to={href} raised>
      <div className="my_playlist_item">
        <div className={`over_layer ${isRtl ? 'rtl' : 'ltr'}`}>
          <Header as={'h2'}>{item.count || 0}</Header>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF" />
        </div>
        <UnitLogo unitId={unit.id} width={520} fallbackImg={canonicalSection} />
      </div>
      <Card.Content>
        <Header size="medium" className="no-margin-top" content={item.name} />
      </Card.Content>
    </Card>
  );

  const renderAsList = () => (
    <Table.Row className="cu_item cu_item_list no-thumbnail" verticalAlign="top" key={unit.id}>
      <Table.Cell width={7} className={'no-padding-top'}>
        <Link to={href}>
          <div className="my_playlist_item">
            <div className="over_layer">
              <Header as={'h3'}>{item.count || 0}</Header>
              <Icon name="list" size="large" />
            </div>
            <UnitLogo unitId={unit.id} width={150} fallbackImg={canonicalSection} />
          </div>
        </Link>
      </Table.Cell>
      <Table.Cell verticalAlign={'top'} className={'cu_item_info'}>
        <Link to={href}>
          <Header as="h4" className="weight-normal no-margin-top">
            {item.name}
            <Header.Subheader>{`${item.count || 0} ${t('personal.videosOnList')}`}</Header.Subheader>
          </Header>
        </Link>
      </Table.Cell>
    </Table.Row>
  );

  return asList ? renderAsList() : renderAsCard();
};
