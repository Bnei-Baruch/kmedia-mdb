import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors as textPage } from '../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../helpers/utils';

const ExpandAllNotesBtn = () => {
  const expandAll = useSelector(state => textPage.getExpandNotes(state.textPage));
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
