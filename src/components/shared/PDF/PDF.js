import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';

import PDFMenu from './PDFMenu';
import { ErrorSplash, LoadingSplash } from '../Splash/Splash';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../helpers/url';

const PDF = ({ pdfFile, startsFrom, isTaas = true }) => {
  const [width, setWidth]       = useState();
  const [numPages, setNumPages] = useState();

  const ref        = useRef();
  const { t }      = useTranslation();
  const navigate   = useNavigate();
  const location   = useLocation();
  const query      = getQuery(location);
  const pageNumber = Number(query.page) || 1;

  const setPage = useCallback(page => {
    navigate({
      pathname: location.pathname,
      search: stringify({ ...query, page }),
    });
  }, [location, navigate]);

  useEffect(() => {
    if (!ref.current) {
      return null;
    }

    const setDivSize = () => setWidth(ref.current.getBoundingClientRect().width);
    setDivSize();
    window.addEventListener('resize', setDivSize);
    return () => {
      window.removeEventListener('resize', setDivSize);
    };
  }, [pdfFile, ref.current]);

  const onDocumentLoadSuccess = ({ numPages: _numPages }) => {
    setNumPages(_numPages);
  };

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const menu = <PDFMenu
    numPages={numPages}
    pageNumber={pageNumber}
    startsFrom={startsFrom}
    setPage={setPage}
    isTaas={isTaas}
  />;
  return (
    <div ref={ref}>
      {menu}
      <div style={{ direction: 'ltr' }} className="position_relative">
        <div className="theme_pdf"></div>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          error={<ErrorSplash text={t('messages.server-error')} subtext={t('messages.failed-to-load-pdf-file')} />}
          loading={<LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />}
        >
          {
            numPages &&
            (
              <Page
                width={width}
                pageNumber={pageNumber + (-startsFrom) + 1}
                renderAnnotations={false}
                renderTextLayer={false}
                renderMode="svg"
              />
            )
          }
        </Document>
      </div>
      {menu}
    </div>
  );
};

PDF.propTypes = {
  pdfFile: PropTypes.string.isRequired,
  startsFrom: PropTypes.number.isRequired,
};

export default PDF;
