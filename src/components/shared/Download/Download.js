import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const fileDownload = (data, path, mimeType, filename = path.split('/').slice(-1)[0]) => {
  const blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  const blobURL          = window.URL.createObjectURL(blob);
  const tempLink         = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href          = blobURL;
  tempLink.setAttribute('download', filename);

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }

  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
};

export const downloadAsset = (path, mimeType, downloadAllowed, name) => {
  if (downloadAllowed) {
    axios({
      url: path,
      headers: {
        Accept: mimeType
      },
      responseType: 'blob'
    }).then(response => {
      fileDownload(response.data, path, mimeType, name);
    });
  } else {
    window.open(path, '_blank');
  }
};

const Download = props => {
  const [ready, setReady]                                                                                     = useState(false);
  const { children = null, path = null, mimeType, downloadAllowed, filename = path?.split('/').slice(-1)[0] } = props;
  useEffect(() => {
    setReady(path !== null && typeof filename !== 'undefined' && typeof document !== 'undefined');
  }, [path, filename]);

  if (!ready) {
    return null;
  }

  const mountPoint = document.getElementById('download-button');
  if (mountPoint === null) {
    return null;
  }

  return ReactDOM.createPortal(
    <Button compact size="small" icon="download" disabled={!path} onClick={() => downloadAsset(path, mimeType, downloadAllowed, filename)}>{children}</Button>,
    mountPoint,
  );
};

Download.propTypes = {
  path: PropTypes.string,
  mimeType: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  downloadAllowed: PropTypes.bool.isRequired,
};

export default Download;
