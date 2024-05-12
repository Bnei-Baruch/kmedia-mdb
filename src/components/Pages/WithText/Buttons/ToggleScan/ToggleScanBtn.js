import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../../../helpers/url';
import ScanPDF from './ScanPDF';
import { createPortal } from 'react-dom';
import { ScanZoomContext } from './ScanZoomContext';

let timeout;
const ToggleScanBtn = () => {
  const location          = useLocation();
  const navigate          = useNavigate();
  const query             = getQuery(location);
  const open              = query.scan === 'true' && typeof window !== 'undefined';
  const file              = useSelector(textPageGetScanFileSelector);
  const [ready, setReady] = useState(false);

  const [zoom, setZoom] = useState(100);
  useEffect(() => {
    //wait for upper DOM element id="text_layout" will ready
    timeout = setTimeout(() => {
      setReady(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!file) return null;

  const toggleOpen = () => {
    navigate({
      pathname: location.pathname,
      search  : stringify({ ...query, scan: !open }),
    });
  };

  return (
    <ScanZoomContext.Provider value={{ zoom, setZoom }}>
      <ToolbarBtnTooltip
        textKey="scan"
        icon={<span className="material-symbols-outlined">image</span>}
        onClick={toggleOpen}
      />
      {open && ready && createPortal(<ScanPDF/>, window.document.getElementById('text_layout'))}
    </ScanZoomContext.Provider>
  );
};

export default ToggleScanBtn;
