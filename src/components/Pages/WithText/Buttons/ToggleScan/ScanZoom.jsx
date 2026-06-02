import React, { useContext } from 'react';
import { ScanZoomContext } from './ScanZoomContext';
import ScanBtnTpl from './ScanBtnTpl';

const ScanZoom = () => {
  const { zoom, setZoom } = useContext(ScanZoomContext);

  const zoomIn  = () => setZoom(zoom + 10);
  const zoomOut = () => setZoom(zoom - 10);
  return (
    <div className="btn_group">
      <ScanBtnTpl
        onClick={zoomOut}
        icon="zoom_out"
      />
      <span>{`${zoom}%`}</span>
      <ScanBtnTpl
        onClick={zoomIn}
        icon="zoom_in"
      />
    </div>
  );
};

export default ScanZoom;
