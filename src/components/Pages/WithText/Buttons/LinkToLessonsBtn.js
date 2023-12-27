import React from 'react';
import { Button } from 'semantic-ui-react';
import Link from '../../../Language/MultiLanguageLink';
import { stringify } from '../../../../helpers/url';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../redux/modules/textPage';

const LinkToLessonsBtn = () => {
  const subject = useSelector(state => textPage.getSubject(state.textPage));
  return (
    <Button
      as={Link}
      to={{ pathname: '/lessons', search: stringify({ 'sources': subject?.id }) }}
      icon={
        <span className="material-symbols-outlined">
          subscriptions
        </span>
      }
    />
  );
};

export default LinkToLessonsBtn;
