import React from 'react';
import { Button } from 'semantic-ui-react';
import { physicalFile } from '../../../../helpers/utils';
import { useSelector } from 'react-redux';
import { downloadAsset } from '../../../shared/Download/Download';
import { textPageGetFileSelector } from '../../../../redux/selectors';

const DownloadTextBtn = () => {
  const file = useSelector(textPageGetFileSelector);

  const handleDownload = () => {
    const { mimetype: mimeType, name: filename } = file;

    const path = physicalFile(file, true);
    downloadAsset(path, mimeType, true, filename);
  };

  return (
    <div>
      <Button
        onClick={handleDownload}
        icon={<span className="material-symbols-outlined">download</span>}
      />
    </div>
  );
};

export default DownloadTextBtn;
