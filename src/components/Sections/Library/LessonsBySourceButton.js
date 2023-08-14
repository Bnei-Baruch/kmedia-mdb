import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Popup, } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import Link from '../../Language/MultiLanguageLink';
import { stringify } from '../../../helpers/url';
import { CT_SOURCE } from '../../../helpers/consts';

const LessonsBySourceButton = ({ source }) => {
  const { t } = useTranslation();
  if (source.subject_type !== CT_SOURCE)
    return null;

  return (
    <Popup
      content={t('share-text.lessons-by-source')}
      trigger={
        <Button
          as={Link}
          to={{ pathname: '/lessons', search: stringify({ 'sources': source.subject_uid }) }}
          compact
          size="small"
          icon={<SectionLogo name="lessons" color="grey" />}
        />
      }
    />
  );
};

LessonsBySourceButton.propTypes = { source: PropTypes.object.isRequired };

export default LessonsBySourceButton;
