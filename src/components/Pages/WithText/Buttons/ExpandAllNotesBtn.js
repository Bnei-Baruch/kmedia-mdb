import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../helpers/utils';
import { textPageGetExpandNotesSelector } from '../../../../redux/selectors';

const ExpandAllNotesBtn = () => {
  const expandAll = useSelector(textPageGetExpandNotesSelector);
  const dispatch  = useDispatch();

  const toggleNotes = e => {
    stopBubbling(e);
    dispatch(actions.expandNotes());
  };

  return (
    <Button
      onClick={toggleNotes}
      active={expandAll}
      icon={<span className="material-symbols-outlined">comment</span>}
    />
  );
};

export default ExpandAllNotesBtn;
