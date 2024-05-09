import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../../../helpers/url';
import ScanPDF from './ScanPDF';
import { createPortal } from 'react-dom';
import { ScanZoomContext } from './ScanZoomContext';

const ToggleScanBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query    = getQuery(location);
  const open     = query.scan === 'true' && typeof window !== 'undefined';
  const file     = useSelector(textPageGetScanFileSelector);

  const [zoom, setZoom] = useState(100);

  if (!file) return null;

  const toggleOpen = () => {
    navigate({
      pathname: location.pathname,
      search  : stringify({ ...query, scan: !open }),
    });
  };

  const targetHtml = window.document.getElementById('text_layout');
  return (
    <ScanZoomContext.Provider value={{ zoom, setZoom }}>
      <ToolbarBtnTooltip
        textKey="scan"
        icon={<span className="material-symbols-outlined">image</span>}
        onClick={toggleOpen}
      />
      {open && targetHtml && createPortal(<ScanPDF/>, targetHtml)}
    </ScanZoomContext.Provider>
  );
};

export default ToggleScanBtn;
