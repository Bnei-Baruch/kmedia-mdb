// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
// https://github.com/wojtekmaj/react-pdf/issues/280
import React from 'react';
import Loadable from 'jaybe-react-loadable';
import { withNamespaces } from 'react-i18next';
import { ErrorSplash, LoadingSplash, } from '../Splash/Splash';
import Loading from '../Loading';

// import { Document, Page, pdfjs } from 'react-pdf';
const LoadedPDF = Loadable({
  loader: () => import(/* webpackChunkName: "ReactPdf" */ 'react-pdf'),
  loading: Loading,
  delay: 200,
  timeout: 5000,
  render(loaded, { pdfFile, onDocumentLoadSuccess, numPages, width, pageNumber, startsFrom, t }) {
    const { pdfjs, Document, Page }     = loaded;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return (
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        error={<ErrorSplash text={t('messages.server-error')} subtext={t('messages.failed-to-load-pdf-file')} />}
        loading={<LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />}
      >
        {
          numPages
            ? (
              <Page
                width={width}
                pageNumber={pageNumber + (-startsFrom) + 1}
                renderAnnotations={false}
                renderTextLayer={false}
                renderMode="canvas"
              />
            )
            : null
        }
      </Document>
    );
  }
});

export default withNamespaces()(LoadedPDF);
