
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../../../helpers/url';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { ScanZoomContext } from './ScanZoomContext';


const ScanPDF = React.lazy(() =>
  Promise.all([import('./ScanPDF'), new Promise(resolve => setTimeout(resolve, 300))])
);

const ToggleScanBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = getQuery(location);
  const open = query.scan === 'true' && typeof window !== 'undefined';
  const file = useSelector(textPageGetScanFileSelector);
  const [zoom, setZoom] = useState(100);

  if (!file) return null;

  const toggleOpen = () => {
    navigate({
      pathname: location.pathname,
      search: stringify({ ...query, scan: !open }),
    });
  };

  return (
    <ScanZoomContext.Provider value={{ zoom, setZoom }}>
      <ToolbarBtnTooltip
        textKey="scan"
        icon={<span className="material-symbols-outlined">image</span>}
        onClick={toggleOpen}
      />
      {open &&
        createPortal(
          <React.Suspense fallback={null}>
            <ScanPDF />
          </React.Suspense>,
          window.document.getElementById('text_layout')
        )}
    </ScanZoomContext.Provider>
  );
};

export default ToggleScanBtn;
