import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions } from '../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../helpers/utils';
import { textPageGetExpandNotesSelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const ExpandAllNotesBtn = () => {
  const { t }     = useTranslation();
  const expandAll = useSelector(textPageGetExpandNotesSelector);
  const dispatch  = useDispatch();

  const toggleNotes = e => {
    stopBubbling(e);
    dispatch(actions.expandNotes());
  };

  return (
    <TooltipForWeb
      text={t(`page-with-text.buttons.${expandAll ? 'collapse' : 'expand'}`)}
      trigger={
        <Button
          onClick={toggleNotes}
          active={expandAll}
          icon={<span className="material-symbols-outlined">comment</span>}
        />
      }
    />
  );
};

export default ExpandAllNotesBtn;
