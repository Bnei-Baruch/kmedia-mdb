import React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../../helpers/utils';

const ZoomSizeBtns = () => {
  const dispatch      = useDispatch();
  const handleSetPlus = e => {
    dispatch(actions.setZoomSize('up'));
    stopBubbling(e);
  };

  const handleSetMinus = e => {
    dispatch(actions.setZoomSize('down'));
    stopBubbling(e);
  };

  return (
    <>
      <button onClick={handleSetPlus} className="flex-1 px-4 py-2 flex items-center justify-center gap-1">
        <span className="material-symbols-outlined large">text_format</span>
        <span className="material-symbols-outlined small">add</span>
      </button>
      <button onClick={handleSetMinus} className="flex-1 px-4 py-2 flex items-center justify-center gap-1">
        <span className="material-symbols-outlined large">text_format</span>
        <span className="material-symbols-outlined small">remove</span>
      </button>
    </>
  );
};

export default ZoomSizeBtns;
