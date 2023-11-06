import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectors as recommended } from '../../../src/redux/modules/recommended';
import { selectors as tags } from '../../../lib/redux/slices/tagsSlice/tagsSlice';
import { CT_TAG } from '../../../src/helpers/consts';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import { canonicalLink } from '../../../src/helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';
import { useTranslation } from '../../i18n/client';

const TagItem = props => {
  const {
          id,
          asList = false,
          link,
          size,
          selected,
          noViews,
          label  = '',
        } = props;

  let { withInfo = undefined } = props;

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();
  const tag                = useSelector(state => tags.getTagById(state.tags)(id));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  if (!tag) return null;
  if (withInfo === undefined) {
    withInfo = true;
  }

  const description = [];
  if (!noViews && !(isMobileDevice && asList) && views > 0) {
    description.push(t('pages.unit.info.views', { views }));
  }

  const _props = {
    tag,
    link: link || canonicalLink({ id: tag.id, content_type: CT_TAG }),
    withCUInfo: false,
    withCCUInfo: withInfo,
    description,
    size: !isMobileDevice ? size : '',
    selected,
    label,
  };

  return (asList ? <ListTemplate {..._props} /> : <CardTemplate {..._props} />);
};

export default TagItem;
