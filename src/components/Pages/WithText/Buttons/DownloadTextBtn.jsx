import React from 'react';
import { useSelector } from 'react-redux';

import { physicalFile } from '../../../../helpers/utils';
import { downloadAsset } from '../../../shared/Download/Download';
import { textPageGetFileSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const DownloadTextBtn = () => {
  const file = useSelector(textPageGetFileSelector);

  const handleDownload = () => {
    const { mimetype: mimeType, name: filename } = file;

    const path = physicalFile(file, true);
    downloadAsset(path, mimeType, true, filename);
  };

  return (
    <ToolbarBtnTooltip
      textKey="download"
      onClick={handleDownload}
      icon={<span className="material-symbols-outlined">download</span>}
    />
  );
};

export default DownloadTextBtn;
