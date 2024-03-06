import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Container, Header, Image, List } from 'semantic-ui-react';
import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import Link from '../../Language/MultiLanguageLink';
import { buildTextItemInfo, textPartLink } from './helper';
import {
  sourcesAreLoadedSelector,
  mdbGetDenormContentUnitSelector,
  mdbGetDenormLabelSelector,
  sourcesGetPathByIDSelector
} from '../../../redux/selectors';

const TextListTemplate = ({ cuID, lID, t }) => {
  const cu               = useSelector(state => mdbGetDenormContentUnitSelector(state, cuID));
  const label            = useSelector(state => mdbGetDenormLabelSelector(state))(lID);
  const areSourcesLoaded = useSelector(sourcesAreLoadedSelector);
  const getPathByID      = useSelector(sourcesGetPathByIDSelector);

  if (!cu) return null;
  const icon = !!label ? 'label' : iconByContentTypeMap.get(cu.content_type) || null;
  const to   = textPartLink(label?.properties, cu);

  const { subTitle, title, description } = buildTextItemInfo(cu, label, t, areSourcesLoaded && getPathByID);
  return (
    <List.Item
      key={cuID}
      className="text_item"
    >
      <Image verticalAlign="top">
        <SectionLogo name={icon} height="60" width="60"/>
      </Image>
      <Container className="text_item__content">
        <Header as={Link} to={to}>
          <Header.Content content={title}/>
          {subTitle && <Header.Subheader content={subTitle}/>}
        </Header>
        <Container className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </Container>
      </Container>
    </List.Item>
  );
};

TextListTemplate.propTypes = {
  cuID: PropTypes.string,
  lID : PropTypes.string

};

export default withTranslation()(TextListTemplate);
