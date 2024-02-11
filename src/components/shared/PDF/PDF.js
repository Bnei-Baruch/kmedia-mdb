import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container, } from 'semantic-ui-react';
import { Document, Page, pdfjs } from 'react-pdf';

import PDFMenu from './PDFMenu';
import { ErrorSplash, LoadingSplash } from '../Splash/Splash';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../helpers/url';

const PDF = ({ pdfFile, startsFrom }) => {
  const [width, setWidth]       = useState();
  const [numPages, setNumPages] = useState();

  const ref        = useRef();
  const { t }      = useTranslation();
  const navigate   = useNavigate();
  const location   = useLocation();
  const query      = getQuery(location);
  const pageNumber = Number(query.page) || 1;

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
    let pageNo;
    if (pageNumber >= startsFrom && pageNumber <= (startsFrom + _numPages + -1)) {
      pageNo = pageNumber;
    } else {
      pageNo = startsFrom;
    }

    setPage(pageNo);
    setNumPages(_numPages);
  };

  const setPage = page => {
    navigate({
      pathname: location.pathname,
      search: stringify({ ...query, page }),
    });
  };

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return (
    <div ref={ref}>
      <Container fluid textAlign="center">
        <PDFMenu
          numPages={numPages}
          pageNumber={pageNumber}
          startsFrom={startsFrom}
          setPage={setPage}
        />
      </Container>
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
      <Container fluid textAlign="center">
        <PDFMenu
          numPages={numPages}
          pageNumber={pageNumber}
          startsFrom={startsFrom}
          setPage={setPage}
        />
      </Container>
    </div>
  );
};

PDF.propTypes = {
  pdfFile: PropTypes.string.isRequired,
  startsFrom: PropTypes.number.isRequired,
};

export default PDF;
