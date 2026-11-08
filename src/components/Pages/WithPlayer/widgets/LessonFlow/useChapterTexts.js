import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../../redux/modules/assets';
import { assetsGetDoc2htmlByIdSelector } from '../../../../../redux/selectors';

// the transcript's speaker mark at the start of a paragraph: shown as the speaker / turn label instead
const MARK_RE = /^\s*(?:קריין|שאלה|תלמיד|תלמידה)\s*:\s*/;

// <p> texts of a doc2html document, by index (the markup's paragraph index); browser only
const paragraphTexts = html => {
  if (!html || typeof window === 'undefined' || !window.DOMParser) return [];
  const doc = new window.DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('p')).map(p => (p.textContent || '').replace(/\s+/g, ' ').trim());
};

/**
 * Paragraphs of the lesson's markup with their text: {i -> {i, start, end, speaker, text}}.
 * Text comes from the transcript the markup was built on (archive-unzip doc2html, the same file the
 * Transcription tab shows) or, for a markup built from the audio, from the markup itself.
 */
const useChapterTexts = markup => {
  const fileUid  = markup?.transcript?.file_uid;
  const byId     = useSelector(assetsGetDoc2htmlByIdSelector);
  const entry    = fileUid ? byId[fileUid] : undefined;
  const dispatch = useDispatch();

  useEffect(() => {
    if (fileUid && !entry) dispatch(actions.doc2html(fileUid));
  }, [fileUid, entry, dispatch]);

  const html = entry?.data;
  return useMemo(() => {
    if (!Array.isArray(markup?.paragraphs)) return {};
    const texts = fileUid ? paragraphTexts(html) : [];
    const res   = {};
    markup.paragraphs.forEach(p => {
      const text = fileUid ? texts[p.i] : p.text;
      if (text) res[p.i] = { ...p, text: text.replace(MARK_RE, '') };
    });
    return res;
  }, [markup, fileUid, html]);
};

export default useChapterTexts;
