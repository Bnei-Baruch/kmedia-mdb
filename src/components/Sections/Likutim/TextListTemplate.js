import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Container, Header, Image, List } from 'semantic-ui-react';
import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';

const TextListTemplate = ({ cuID, t }) => {
  const cu = useSelector(state => mdbGetDenormContentUnitSelector(state, cuID));

  if (!cu) return null;

  const { content_type, film_date, name } = cu;
  const icon                              = iconByContentTypeMap.get(content_type);
  const to                                = canonicalLink(cu);

  return (
    <List.Item
      key={cuID}
      className="text_item"
    >
      <Image verticalAlign="top">
        <SectionLogo name={icon} height="60" width="60"/>
      </Image>
      <Container className="text_item__content">
        <Header as={Link} to={to} content={name}/>
        <Container className="description is_single">
          <span>{t('values.date', { date: film_date })}</span>
        </Container>
      </Container>
    </List.Item>
  );
};

TextListTemplate.propTypes = {
  cuID: PropTypes.string
};

export default withTranslation()(TextListTemplate);
