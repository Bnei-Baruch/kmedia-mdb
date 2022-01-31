import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Image } from 'semantic-ui-react';
import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as sources } from '../../../redux/modules/sources';
import { buildBookmarkLink } from '../Personal/Bookmarks/Bookmarks/helper';
import { withNamespaces } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { buildTextUnitInfo } from './helper';

const TextItem = ({ item, t }) => {
  const { content_unit_uid, label, content_type } = item;

  const unit        = useSelector(state => mdb.getDenormContentUnit(state.mdb, content_unit_uid));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));
  const icon        = iconByContentTypeMap.get(content_type) || null;

  const link                             = buildBookmarkLink(label, unit);
  const { subTitle, title, description } = buildTextUnitInfo(unit, t, getPathByID, item);
  return (
    <Container
      key={content_unit_uid}
      className="cu_item cu_item_list"
    >
      <Image size="tiny" verticalAlign="middle">
        <SectionLogo name={icon} width="25" height="25" />
      </Image>
      <Container className="cu_item_info">
        <div>
          {subTitle}
        </div>
        <Header as={Link} to={link} size="small">
          {title}
        </Header>
        <div className="text_ellipsis description">
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </Container>
    </Container>
  );
};

TextItem.propTypes = {
  item: PropTypes.object.isRequired,

};

export default withNamespaces()(TextItem);
