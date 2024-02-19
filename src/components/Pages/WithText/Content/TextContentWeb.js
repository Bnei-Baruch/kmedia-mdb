import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { urlParamFromSelect } from '../scrollToSearch/helper';
import { actions } from '../../../../redux/modules/textPage';
import NoteMarks from '../Notes/NoteMarks';
import ContentHtml from './ContentHtml';
import { useLabels } from '../hooks/useLabels';
import LabelMarks from '../Labels/LabelMarks';
import PDF from '../../../shared/PDF/PDF';
import { startsFrom } from '../../../shared/PDF/helper';
import { physicalFile, isEmpty } from '../../../../helpers/utils';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetTextOnlySelector
} from '../../../../redux/selectors';
import NotFound from '../../../shared/NotFound';

const TextContentWeb = ({ playerPage }) => {
  const [parentTop, setParentTop] = useState(0);

  const { fontType, zoomSize } = useSelector(textPageGetSettings);
  const textOnly               = useSelector(textPageGetTextOnlySelector);
  const subject                = useSelector(textPageGetSubjectSelector);
  const file                   = useSelector(textPageGetFileSelector);

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

  if (!file)
    return <NotFound textKey={playerPage && 'materials.transcription.no-content'} />;
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
  }

  return (
    <div className={`text__content-wrapper is-${fontType} zoom_size_${!pdf ? zoomSize : 2}`}>
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
              startsFrom={startsFrom(subject.id) || 1}
            />
          ) : (
            <div ref={handleDataRef} className="position_relative">
              <ContentHtml labels={labels} />
            </div>
          )
        }
      </div>
      <div></div>
    </div>
  );
};

export default TextContentWeb;
