import React from 'react';
import { Button } from 'semantic-ui-react';
import Link from '../../../Language/MultiLanguageLink';
import { stringify } from '../../../../helpers/url';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import { CT_SOURCE, CT_LIKUTIM } from '../../../../helpers/consts';

const linkByCT         = {
  [CT_SOURCE]: 'sources',
  [CT_LIKUTIM]: 'likutim',
};
const LinkToLessonsBtn = () => {
  const subject = useSelector(state => textPage.getSubject(state.textPage));

  if (!subject) return null;

  return (
    <Button
      as={Link}
      to={{ pathname: '/lessons', search: stringify({ [linkByCT[subject.type]]: subject.id }) }}
      icon={<span className="material-symbols-outlined">subscriptions</span>}
    />
  );
};

export default LinkToLessonsBtn;
