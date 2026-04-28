import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';

const TextListTemplate = ({ cuID }) => {
  const { t } = useTranslation();
  const cu = useSelector(state => mdbGetDenormContentUnitSelector(state, cuID));

  if (!cu) return null;

  const { content_type, film_date, name } = cu;
  const icon                              = iconByContentTypeMap.get(content_type);
  const to                                = canonicalLink(cu);

  return (
    <div
      key={cuID}
      className="text_item"
    >
      <div className="align-top">
        <SectionLogo name={icon} height="60" width="60"/>
      </div>
      <div className="text_item__content">
        <Link to={to} className="large font-bold">{name}</Link>
        <div className="description is_single">
          <span>{t('values.date', { date: film_date })}</span>
        </div>
      </div>
    </div>
  );
};

TextListTemplate.propTypes = {
  cuID: PropTypes.string
};

export default TextListTemplate;
