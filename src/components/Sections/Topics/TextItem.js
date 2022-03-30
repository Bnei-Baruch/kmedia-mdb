import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Image } from 'semantic-ui-react';
import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { useSelector } from 'react-redux';
import { selectors as sources } from '../../../redux/modules/sources';
import { buildBookmarkLink } from '../Personal/Bookmarks/Bookmarks/helper';
import { withNamespaces } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { buildTextUnitInfo } from './helper';
import clsx from 'clsx';

const TextItem = ({ item, t }) => {
  const { cu: { id, content_type }, label } = item;

  const getPathByID = useSelector(state => sources.getPathByID(state.sources));
  const icon        = label ? 'label' : iconByContentTypeMap.get(content_type) || null;
  const link                             = buildBookmarkLink(label, item.cu);
  const { subTitle, title, description } = buildTextUnitInfo(item, t, getPathByID);
  return (
    <Container
      key={id}
      className="cu_item cu_item_list"
    >
      <Image size="tiny" verticalAlign="middle">
        <SectionLogo name={icon} height="50" width="45" />
      </Image>
      <Container className="cu_item_info">
        <div>
          {subTitle}
        </div>
        <Header as={Link} to={link} size="small">
          {title}
        </Header>
        <Container className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </Container>
      </Container>
    </Container>
  );
};

TextItem.propTypes = {
  item: PropTypes.object.isRequired,

};

export default withNamespaces()(TextItem);
