import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../../helpers/utils';
import { textPageGetFileSelector } from '../../../../../redux/selectors';

const ZoomSizeBtns = () => {
  const dispatch      = useDispatch();
  const { isPdf }     = useSelector(textPageGetFileSelector);
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
      <Menu.Item onClick={handleSetPlus} disabled={isPdf}>
        <Icon name="font" size="large" />
        <Icon name="plus" size="small" />
      </Menu.Item>
      <Menu.Item onClick={handleSetMinus} disabled={isPdf}>
        <Icon name="font" size="large" />
        <Icon name="minus" size="small" />
      </Menu.Item>
    </>
  );
};

export default ZoomSizeBtns;
