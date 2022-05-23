import React from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Header, Image, List } from 'semantic-ui-react';
import clsx from 'clsx';

import { selectors as sources } from '../../../redux/modules/sources';
import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { buildTextItemInfo, textPartLink } from './helper';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';

const TextListTemplate = ({ label, unit, t }) => {
  const { id, content_type } = unit;

  const areSourcesLoaded                 = useSelector(state => sources.areSourcesLoaded(state.sources));
  const getPathByID                      = useSelector(state => sources.getPathByID(state.sources));
  const icon                             = !!label ? 'label' : iconByContentTypeMap.get(content_type) || null;
  const link                             = textPartLink(label?.properties, unit);
  const { subTitle, title, description } = buildTextItemInfo(unit, label, t, areSourcesLoaded && getPathByID);
  return (
    <List.Item
      key={id}
      className="text_item"
    >
      <Image verticalAlign="top" >
        <SectionLogo name={icon} height="60" width="60" />
      </Image>
      <Container className="text_item__content">
        <Header as={Link} to={link}>
          <Header.Content content={title} />
          {subTitle && <Header.Subheader content={subTitle} />}
        </Header>
        <Container className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </Container>
      </Container>
    </List.Item>
  );
};

TextListTemplate.propTypes = {
  unit: shapes.ContentUnit,
  label: shapes.Label,

};

export default withNamespaces()(TextListTemplate);
