import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import Link from '../../../Language/MultiLanguageLink';
import { stringify } from '../../../../helpers/url';
import { useSelector } from 'react-redux';
import { CT_SOURCE, CT_LIKUTIM } from '../../../../helpers/consts';
import { textPageGetSubjectSelector } from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';

const linkByCT         = {
  [CT_SOURCE]: 'sources',
  [CT_LIKUTIM]: 'likutim',
};
const LinkToLessonsBtn = () => {
  const { t }    = useTranslation();

  const subject = useSelector(textPageGetSubjectSelector);

  if (!subject) return null;

  return (
    <Popup
      on="hover"
      content={t('page-with-text.buttons.lessons')}
      trigger={
        (
          <Button
            as={Link}
            to={{ pathname: '/lessons', search: stringify({ [linkByCT[subject.type]]: subject.id }) }}
            icon={<span className="material-symbols-outlined">subscriptions</span>}
          />
        )
      }
    />
  );
};

export default LinkToLessonsBtn;
