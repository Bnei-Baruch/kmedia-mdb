import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { Button, Popup, } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import { stringify } from '../../../helpers/url';
import { CT_SOURCE } from '../../../helpers/consts';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const LessonsBySourceButton = () => {
  const { t }        = useTranslation();
  const { id, type } = useSelector(state => selectors.getSubjectInfo(state.textFile));
  if (type !== CT_SOURCE)
    return null;

  return (
    <Popup
      content={t('share-text.lessons-by-source')}
      trigger={
        <Button
          as={Link}
          href={{ pathname: '/lessons', query: stringify({ 'sources': id }) }}
          compact
          size="small"
          icon={<SectionLogo name="lessons" color="grey" />}
        />
      }
    />
  );
};

export default LessonsBySourceButton;
