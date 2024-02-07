import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';
import { textPageGetScanInfoSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const ToggleScanBtn = () => {
  const dispatch = useDispatch();

  const { on, file } = useSelector(textPageGetScanInfoSelector);

  if (!file) return null;

  const handle = () => dispatch(actions.toggleScan());

  return (
    <ToolbarBtnTooltip
      textKey={on ? 'scan-off' : 'scan-on'}
      trigger={
        (
          <Button
            active={on}
            onClick={handle}
            icon={<span className="material-symbols-outlined">image</span>}
          />
        )
      }
    />
  );
};

export default ToggleScanBtn;
