import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTextOnlySelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const AdditionsVisibilityBtn = () => {
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const textOnly = useSelector(textPageGetTextOnlySelector);

  const toggle = () => dispatch(actions.toggleTextOnly());

  return (
    <TooltipForWeb
      text={t(`page-with-text.buttons.${textOnly ? 'hide-additions' : 'show-additions'}`)}
      trigger={
        <Button
          onClick={toggle}
          active={textOnly}
          icon={<span className="material-symbols-outlined">visibility_off</span>}
        />
      }
    />
  );
};

export default AdditionsVisibilityBtn;
