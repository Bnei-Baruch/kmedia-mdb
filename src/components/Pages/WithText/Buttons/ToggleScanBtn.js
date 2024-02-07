import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { textPageGetScanFileSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import PDF from '../../../shared/PDF/PDF';
import { physicalFile } from '../../../../helpers/utils';

const ToggleScanBtn = () => {

  const file = useSelector(textPageGetScanFileSelector);

  if (!file) return null;

  const trigger = (
    <div>
      <ToolbarBtnTooltip
        textKey="scan"
        trigger={<Button icon={<span className="material-symbols-outlined">image</span>} />}
      />
    </div>
  );
  return (
    <Modal
      size="large"
      trigger={trigger}
      closeIcon={<Icon name="times circle outline" />}
    >
      <Modal.Content>
        <PDF
          pdfFile={physicalFile(file)}
          pageNumber={1}
          startsFrom={1}
        />
      </Modal.Content>
    </Modal>
  );
};

export default ToggleScanBtn;
