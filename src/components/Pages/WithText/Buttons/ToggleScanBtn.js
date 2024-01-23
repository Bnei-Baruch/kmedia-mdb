import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { actions } from '../../../../redux/modules/textPage';
import { useDispatch, useSelector } from 'react-redux';
import { textPageGetScanInfoSelector } from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';

const ToggleScanBtn = () => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { on, file } = useSelector(textPageGetScanInfoSelector);

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
