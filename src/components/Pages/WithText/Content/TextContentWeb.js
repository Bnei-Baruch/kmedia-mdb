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

const TextContentWeb = () => {
  const [parentTop, setParentTop] = useState(0);

  const { fontType, theme, zoomSize } = useSelector(state => textPage.getSettings(state.textPage), shallowEqual);
  const textOnly                      = useSelector(state => textPage.getTextOnly(state.textPage));

  const notes               = useNotes();
  const { labels, offsets } = useLabels();

  const dispatch = useDispatch();
  useEffect(() => {
    const handleSelectionChange = debounce((e, x) => {
      const { query, wordOffset } = urlParamFromSelect();
      dispatch(actions.setUrlSelect(query));
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

  return (
    <div className={`text__content-wrapper is-${theme} is-${fontType}`} style={{ zoom: zoomSize }}>
      {
        !textOnly && (
          <div className="text__content-markers">
            <NoteMarks parentTop={parentTop} />
            <LabelMarks labels={labels} offsets={offsets} />
          </div>
        )
      }
      <div className="font_settings text__content">
        <div ref={handleDataRef} className="position_relative">
          <ContentHtml labels={labels} notes={notes} />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default TextContentWeb;
