import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as recommended } from '../../../src/redux/modules/recommended';
import { selectors as sources } from '../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { CT_SOURCE, } from '../../../src/helpers/consts';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import { canonicalLink } from '../../../src/helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';
import { useTranslation } from '../../i18n/client';

const SourceItem = (
  {
    id,
    asList = false,
    link,
    size,
    selected,
    noViews,
    label = '',
    withInfo = undefined
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();
  const source             = useSelector(state => sources.getSourceById(state.sources)(id));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  if (!source) return null;
  if (withInfo === undefined) {
    withInfo = true;
  }

  const description = [];
  if (!noViews && !(isMobileDevice && asList) && views > 0)
    description.push(t('pages.unit.info.views', { views }));

  const props = {
    source,
    link: link || canonicalLink({ id: source.id, content_type: CT_SOURCE }),
    withCUInfo: false,
    withCCUInfo: withInfo,
    description,
    size: !isMobileDevice ? size : '',
    selected,
    label,
  };

  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

SourceItem.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.object,
  asList: PropTypes.bool,
};

export default SourceItem;
