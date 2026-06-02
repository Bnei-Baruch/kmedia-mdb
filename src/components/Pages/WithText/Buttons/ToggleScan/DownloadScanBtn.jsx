import React from 'react';
import { useSelector } from 'react-redux';

import { physicalFile, stopBubbling } from '../../../../../helpers/utils';
import { downloadAsset } from '../../../../shared/Download/Download';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import ScanBtnTpl from './ScanBtnTpl';

const DownloadScanBtn = () => {
  const file = useSelector(textPageGetScanFileSelector);

  const handleDownload = e => {
    const { mimetype: mimeType, name: filename } = file;

    const path = physicalFile(file, true);
    downloadAsset(path, mimeType, true, filename);
    stopBubbling(e);
    return null;
  };

  return (
    <ScanBtnTpl
      onClick={handleDownload}
      icon="download"
      textKey="download"
    />
  );
};

export default DownloadScanBtn;
