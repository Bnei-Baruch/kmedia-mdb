import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../../helpers/utils';

const ZoomSizeBtns = () => {
  const dispatch       = useDispatch();
  const handleSetPlus  = e => {
    dispatch(actions.setZoomSize('up'));
    stopBubbling(e);
  };
  const handleSetMinus = e => {
    dispatch(actions.setZoomSize('down'));
    stopBubbling(e);
  };

  return (
    <>
      <Menu.Item onClick={handleSetPlus}>
        <Icon name="font" size="large" />
        <Icon name="plus" size="small" />
      </Menu.Item>
      <Menu.Item onClick={handleSetMinus}>
        <Icon name="font" size="large" />
        <Icon name="minus" size="small" />
      </Menu.Item>
    </>
  );
};

export default ZoomSizeBtns;
