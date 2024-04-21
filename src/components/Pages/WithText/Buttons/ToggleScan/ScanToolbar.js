import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import AddScanBookmarkBtn from './AddScanBookmarkBtn';
import DownloadScanBtn from './DownloadScanBtn';
import ScanZoom from './ScanZoom';
import ShareScanBtn from './ShareScanBtn';
import ScanBtnTpl from './ScanBtnTpl';
import { useTranslation } from 'react-i18next';

const ScanToolbar = ({ numPages, page = 1, goToPage, close }) => {
  const [inputValue, setInputValue] = useState(page);
  const { t }                       = useTranslation();

  useEffect(() => {
    setInputValue('');
  }, [page]);

  const onKeyDown = e => {
    // Enter
    if (e.keyCode === 13) {
      handleSubmit();
      setInputValue(null);
    }
  };

  const handleSubmit = () => {
    let val = inputValue;
    if (val > numPages)
      val = numPages;
    else if (val < 0)
      val = 0;

    goToPage(val);
  };

  const handleChange = ({ currentTarget: { value } }) => setInputValue(parseInt(value));

  return (
    <div className="text__scan_toolbar">
      <div className="btn_group">
        <ScanBtnTpl
          onClick={close}
          icon="close"
          text={t('buttons.close')}
        />
        <div className="divider"></div>
        <ScanZoom/>
      </div>
      <Input
        className="pdf_input_wrapper"
        value={inputValue}
        onChange={handleChange}
        placeholder={`${page}/${numPages}`}
        onKeyDown={onKeyDown}
      />

      <div className="btn_group">
        <AddScanBookmarkBtn/>
        <div className="divider"></div>
        <DownloadScanBtn/>
        <div className="divider"></div>
        <ShareScanBtn/>
      </div>
    </div>
  );
};

export default ScanToolbar;
