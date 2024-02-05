import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { physicalFile } from '../../../../helpers/utils';
import { downloadAsset } from '../../../shared/Download/Download';
import { textPageGetFileSelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const DownloadTextBtn = () => {
  const { t } = useTranslation();
  const file  = useSelector(textPageGetFileSelector);

  const handleDownload = () => {
    const { mimetype: mimeType, name: filename } = file;

    const path = physicalFile(file, true);
    downloadAsset(path, mimeType, true, filename);
  };

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.download')}
      trigger={
        <Button
          onClick={handleDownload}
          icon={<span className="material-symbols-outlined">download</span>}
        />
      }
    />
  );
};

export default DownloadTextBtn;
