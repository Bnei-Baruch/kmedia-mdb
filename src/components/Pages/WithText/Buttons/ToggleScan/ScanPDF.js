import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuery, stringify } from '../../../../../helpers/url';
import { Button } from 'semantic-ui-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ErrorSplash, LoadingSplash } from '../../../../shared/Splash/Splash';
import { physicalFile } from '../../../../../helpers/utils';
import { useSelector } from 'react-redux';
import { textPageGetScanFileSelector } from '../../../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import ScanToolbar from './ScanToolbar';
import { ScanZoomContext } from './ScanZoomContext';

const ScanPDF = () => {
  const { t }              = useTranslation();
  const location           = useLocation();
  const navigate           = useNavigate();
  const { scan, ...query } = getQuery(location);
  const file               = useSelector(textPageGetScanFileSelector);
  const ref                = useRef(null);

  const [width, setWidth]           = useState();
  const [numPages, setNumPages]     = useState();
  const [inputValue, setInputValue] = useState(1);
  const { zoom }                    = useContext(ScanZoomContext);

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
  }, [file]);

  const close = useCallback(() => {
    navigate({ pathname: location.pathname, search: stringify(query) });
  }, [query, location, navigate]);

  const pagePrev = () => setInputValue(inputValue - 1);
  const pageNext = () => setInputValue(inputValue + 1);
  const goToPage = useCallback(setInputValue, [setInputValue]);

  const onDocumentLoadSuccess         = ({ numPages: _numPages }) => setNumPages(_numPages);
  const _file                         = physicalFile(file);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return (
    <div className="text__scan">
      <ScanToolbar
        numPages={numPages}
        page={inputValue}
        goToPage={goToPage}
        close={close}
      />
      <div className="text__scan_content">
        <div className="text__scan_prev_next">
          {
            numPages > 1 && (
              <Button
                icon={<span className="material-symbols-outlined">arrow_forward</span>}
                onClick={pageNext}
                className="text__scan-right"
                color="blue"
                disabled={inputValue + 1 > numPages}
              />
            )
          }
        </div>
        <div className="text__scan_pdf" ref={ref} style={{ zoom: `${zoom}%` }}>
          <Document
            file={_file}
            onLoadSuccess={onDocumentLoadSuccess}
            error={<ErrorSplash text={t('messages.server-error')} subtext={t('messages.failed-to-load-pdf-file')}/>}
            loading={<LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')}/>}
          >
            {
              numPages &&
              (
                <Page
                  width={width}
                  pageNumber={(inputValue)}
                  renderAnnotations={false}
                  renderTextLayer={false}
                  renderMode="svg"
                />
              )
            }
          </Document>
        </div>
        <div className="text__scan_prev_next">
          {
            numPages > 1 && (
              <Button
                icon={<span className="material-symbols-outlined">arrow_back</span>}
                onClick={pagePrev}
                className="text__scan-left"
                color="blue"
                disabled={inputValue < 2}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ScanPDF;
