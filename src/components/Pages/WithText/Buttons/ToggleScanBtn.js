import React from 'react';
import { Button } from 'semantic-ui-react';
import { actions } from '../../../../redux/modules/textPage';
import { useDispatch, useSelector } from 'react-redux';
import { textPageGetScanInfoSelector } from '../../../../redux/selectors';

const ToggleScanBtn = () => {
  const { on, file } = useSelector(textPageGetScanInfoSelector);
  const dispatch     = useDispatch();

  if (!file) return null;

  const handle = () => dispatch(actions.toggleScan());

  return (
    <Button
      active={on}
      onClick={handle}
      icon={<span className="material-symbols-outlined">image</span>}
    />
  );
};

export default ToggleScanBtn;
