import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const fileDownload = (data, path, mimeType) => {
  const [filename] = path.split('/').slice(-1);

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

const downloadAsset = (path, mimeType, downloadAllowed) => {
  if (downloadAllowed) {
    axios({
      url: path,
      headers: {
        Accept: mimeType
      },
      responseType: 'blob'
    }).then((response) => {
      fileDownload(response.data, path, mimeType);
    });
  } else {
    window.open(path, '_blank');
  }
};

const Download = (props) => {
  const { children = null, path = null, mimeType, downloadAllowed} = props;
  if (path === null) {
    return null;
  }
  const [filename] = path.split('/').slice(-1);
  if (typeof filename === 'undefined') {
    return null;
  }

  const mountPoint = document.getElementById('download-button');
  if (mountPoint === null) {
    return null;
  }

  return ReactDOM.createPortal(
    <Button compact size="small" icon="download" onClick={() => downloadAsset(path, mimeType, downloadAllowed)}>{children}</Button>,
    mountPoint,
  );
};

Download.propTypes = {
  path: PropTypes.string,
  mimeType: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  downloadAllowed: PropTypes.bool.isRequired,
};

export default Download;
