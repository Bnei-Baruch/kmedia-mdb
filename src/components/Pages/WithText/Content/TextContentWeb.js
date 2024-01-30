import React, { useEffect, useState } from 'react';
import { urlParamFromSelect } from '../scrollToSearch/helper';
import { useNotes } from '../Notes/useNotes';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import NoteMarks from '../Notes/NoteMarks';
import debounce from 'lodash/debounce';
import ContentHtml from './ContentHtml';
import { useLabels } from '../hooks/useLabels';
import LabelMarks from '../Labels/LabelMarks';
import PDF, { startsFrom } from '../../../shared/PDF/PDF';
import { physicalFile, isEmpty } from '../../../../helpers/utils';
import clsx from 'clsx';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetTextOnlySelector,
  textPageGetScanInfoSelector
} from '../../../../redux/selectors';

const TextContentWeb = () => {
  const [parentTop, setParentTop] = useState(0);

  const { fontType, zoomSize } = useSelector(textPageGetSettings);
  const textOnly               = useSelector(textPageGetTextOnlySelector);
  const subject                = useSelector(textPageGetSubjectSelector);
  const file                   = useSelector(textPageGetFileSelector);
  const scanInfo               = useSelector(textPageGetScanInfoSelector);

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

    const rect = r.getBoundingClientRect();
    setParentTop(rect.top - window.scrollY);
    dispatch(actions.setSideOffset(rect.left));
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
    <div className={clsx(`text__content-wrapper is-${fontType} zoom-size_${zoomSize}`, { 'is-pdf': !!pdf })}>
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
