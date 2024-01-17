import React, { useEffect, useState } from 'react';
import { urlParamFromSelect } from '../scrollToSearch/helper';
import { useNotes } from '../Notes/useNotes';
import { useDispatch, useSelector, shallowEqual, batch } from 'react-redux';
import { actions, selectors as textPage } from '../../../../redux/modules/textPage';
import NoteMarks from '../Notes/NoteMarks';
import debounce from 'lodash/debounce';
import ContentHtml from './ContentHtml';
import { useLabels } from '../hooks/useLabels';
import LabelMarks from '../Labels/LabelMarks';
import PDF, { startsFrom } from '../../../shared/PDF/PDF';
import { physicalFile, isEmpty } from '../../../../helpers/utils';
import clsx from 'clsx';

const TextContentWeb = () => {
  const [parentTop, setParentTop] = useState(0);

  const { fontType, zoomSize } = useSelector(state => textPage.getSettings(state.textPage), shallowEqual);
  const textOnly               = useSelector(state => textPage.getTextOnly(state.textPage));
  const subject                = useSelector(state => textPage.getSubject(state.textPage));
  const file                   = useSelector(state => textPage.getFile(state.textPage));
  const scanInfo               = useSelector(state => textPage.getScanInfo(state.textPage));

  const notes               = useNotes();
  const { labels, offsets } = useLabels();

  const dispatch = useDispatch();
  useEffect(() => {
    const handleSelectionChange = debounce((e, x) => {
      const { query, wordOffset } = urlParamFromSelect();
      dispatch(actions.setUrlSelect(query));
      dispatch(actions.setWordOffset(wordOffset));
    }, 300);

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      dispatch(actions.setUrlSelect());
    };
  }, []);

  const handleDataRef = r => {
    if (!r) return;
    batch(() => {
      const rect = r.getBoundingClientRect();
      setParentTop(rect.top - window.scrollY);
      dispatch(actions.setSideOffset(rect.left));
    });
  };

  let pdf;
  if (isEmpty(file)) {
    return null;
  } else if (file.isPdf) {
    pdf = file;
  } else if (scanInfo.on) {
    pdf = scanInfo.file;
  }

  return (
    <div
      className={`text__content-wrapper is-${fontType}`}
      style={{ zoom: zoomSize }}
    >
      {
        !textOnly && (
          <div className="text__content-markers no_print">
            <NoteMarks parentTop={parentTop} />
            <LabelMarks labels={labels} offsets={offsets} />
          </div>
        )
      }
      <div className={clsx('font_settings text__content', { 'text_pdf': !!pdf })}>
        {
          !!pdf ? (
            <PDF
              pdfFile={physicalFile(pdf)}
              pageNumber={1}
              startsFrom={startsFrom(subject.id) || 1}
            />
          ) : (
            <div ref={handleDataRef} className="position_relative">
              <ContentHtml labels={labels} notes={notes} />
            </div>
          )
        }
      </div>
      <div></div>
    </div>
  );
};

export default TextContentWeb;
