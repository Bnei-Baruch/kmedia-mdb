import React, { useEffect } from 'react';
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

const downloadAsset = (path, mimeType, downloadAllowed, name) => {
  if (downloadAllowed) {
    return axios({
      url: path,
      headers: {
        Accept: mimeType
      },
      responseType: 'blob'
    }).then(response => {
      fileDownload(response.data, path, mimeType, name);
    });
  }

  window.open(path, '_blank');
  return Promise.resolve();

};

const Download = props => {
  const {
    children = null,
    path     = null,
    mimeType,
    downloadAllowed,
    filename = path?.split('/').slice(-1)[0],
    elId     = 'download-button',
    handleDidMount,
    ...params
  } = props;

  useEffect(() => {
    handleDidMount && handleDidMount();
  }, [path]);

  if (path === null || typeof filename === 'undefined') {
    return null;
  }

  const mountPoint = document.getElementById(elId);
  if (mountPoint === null) {
    return null;
  }

  const handleOnClick = () => downloadAsset(path, mimeType, downloadAllowed, filename);

  return ReactDOM.createPortal(
    <Button
      compact
      size="small"
      icon="download"
      onClick={handleOnClick}
      {...params}
    >
      {children}
    </Button>,
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
  elId: PropTypes.string,
};

export default Download;

export const DownloadNoPortal = props => {
  const {
    children        = null,
    path            = null,
    mimeType,
    filename        = path?.split('/').slice(-1)[0],
    downloadAllowed = true,
    onLoadStart,
    ...params
  } = props;

  const handleOnClick = () => {
    onLoadStart && onLoadStart();
    return downloadAsset(path, mimeType, downloadAllowed, filename);
  };

  return (
    <Button
      compact
      size="small"
      icon="download"
      onClick={handleOnClick}
      {...params}
    >
      {children}
    </Button>
  );
};

DownloadNoPortal.propTypes = {
  path: PropTypes.string,
  mimeType: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  downloadAllowed: PropTypes.bool.isRequired,
  onLoadStart: PropTypes.func,
};
