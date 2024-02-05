import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Link from '../../../Language/MultiLanguageLink';
import { stringify } from '../../../../helpers/url';
import { CT_SOURCE, CT_LIKUTIM } from '../../../../helpers/consts';
import { textPageGetSubjectSelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const linkByCT         = {
  [CT_SOURCE]: 'sources',
  [CT_LIKUTIM]: 'likutim',
};
const LinkToLessonsBtn = () => {
  const { t } = useTranslation();

  const subject = useSelector(textPageGetSubjectSelector);

  if (!subject) return null;

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.lessons')}
      trigger={
        <Button
          as={Link}
          to={{ pathname: '/lessons', search: stringify({ [linkByCT[subject.type]]: subject.id }) }}
          icon={<span className="material-symbols-outlined">subscriptions</span>}
        />
      }
    />
  );
};

export default LinkToLessonsBtn;
