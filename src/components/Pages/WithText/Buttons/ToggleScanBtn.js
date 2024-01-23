import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { actions } from '../../../../redux/modules/textPage';
import { useDispatch, useSelector } from 'react-redux';
import { textPageGetScanInfoSelector } from '../../../../redux/selectors';

const ToggleScanBtn = () => {
  const { on, file } = useSelector(textPageGetScanInfoSelector);
  const dispatch     = useDispatch();

  if (!file) return null;

  const handle = () => dispatch(actions.toggleScan());

  return (
    <Popup
      on="hover"
      content={t('page-with-text.buttons.scan')}
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
