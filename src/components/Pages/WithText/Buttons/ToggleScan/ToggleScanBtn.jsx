
import { lazy, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../../../helpers/url';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { ScanZoomContext } from './ScanZoomContext';


const ScanPDF = lazy(() =>
  Promise.all([import('./ScanPDF'), new Promise(resolve => setTimeout(resolve, 300))]).then(([module]) => module)
);

const ToggleScanBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = getQuery(location);
  const open = query.scan === 'true' && typeof window !== 'undefined';
  const file = useSelector(textPageGetScanFileSelector);
  const [zoom, setZoom] = useState(100);
  const [container, setContainer] = useState(null);

  // The layout div is not in the DOM yet during the first render (initial load with ?scan=true)
  useEffect(() => {
    if (open) setContainer(document.getElementById('text_layout'));
  }, [open]);

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
      {open && container &&
        createPortal(
          <Suspense fallback={null}>
            <ScanPDF />
          </Suspense>,
          container
        )}
    </ScanZoomContext.Provider>
  );
};

export default ToggleScanBtn;
