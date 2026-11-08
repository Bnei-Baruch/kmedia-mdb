import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { KEEP_LETTERS_RE, OFFSET_TEXT_SEPARATOR, SPACES_RE } from '../../../WithText/scrollToSearch/helper';
import { NOT_LETTER_CHAR } from '../../../../../helpers/strings';
import { getQuery, splitPathByLanguage, stringify } from '../../../../../helpers/url';
import { toHumanReadableTime } from '../../../../../helpers/time';
import { actions as textPageActions } from '../../../../../redux/modules/textPage';
import {
  assetsGetDoc2htmlByIdSelector,
  textPageGetFileSelector,
  textPageGetSubjectSelector
} from '../../../../../redux/selectors';

// as the text page's own quote links (scrollToSearch/helper: MIN_NUMBER_WORDS_IN_LINK)
const LINK_WORDS = 5;

const linkWords = text => text
  .replace(KEEP_LETTERS_RE, ' ')
  .replace(SPACES_RE, ' ')
  .replace(/\s+/g, ' ')
  .split(' ')
  .filter(w => !!w && !NOT_LETTER_CHAR.includes(w));

const cleanText = html => html.replace(/<.+?>/g, '');

/**
 * srchstart / srchend of the i-th <p> of a doc2html document: the paragraph's first and last words and their
 * offsets in the text without tags, as the Transcription tab finds a quote (scrollToSearch RenderHighlightBorder).
 * null if there is no such paragraph or it has no words.
 */
export const paragraphQuery = (html, i) => {
  if (!html || !Number.isInteger(i) || i < 0) return null;
  // the same normalization as RenderBase, so the offsets match its clean text
  const source = html.replace(SPACES_RE, ' ').replace(/\s+/gi, ' ');
  const re     = /<p\b[^>]*>/gi;
  let m;
  for (let k = 0; (m = re.exec(source)); k++) if (k === i) break;
  if (!m) return null;

  const from  = m.index + m[0].length;
  const close = source.indexOf('</p>', from);
  const inner = cleanText(source.slice(from, close < 0 ? undefined : close));
  const words = linkWords(inner);
  if (words.length === 0) return null;

  const offset = cleanText(source.slice(0, from)).length;
  const start  = words.slice(0, LINK_WORDS).join(' ');
  const end    = words.slice(-LINK_WORDS).join(' ');
  return {
    srchstart: `${start}${OFFSET_TEXT_SEPARATOR}${offset}`,
    srchend  : `${end}${OFFSET_TEXT_SEPARATOR}${Math.max(offset, offset + inner.length - end.length)}`
  };
};

// the paragraph of the markup playing at `time`; null before the first one
export const paragraphAt = (paragraphs, time) => {
  let res = null;
  (paragraphs || []).forEach(p => {
    if (p.start <= time && (!res || p.start >= res.start)) res = p;
  });
  return res;
};

/**
 * Links from the lesson's markup to its transcript: open the Transcription tab with a paragraph highlighted
 * (the markup's transcript language), or a shareable URL to the moment + the paragraph.
 * Only for a markup built on a transcript (it has transcript.file_uid).
 */
export const useTranscriptLink = markup => {
  const fileUid  = markup?.transcript?.file_uid;
  const html     = useSelector(assetsGetDoc2htmlByIdSelector)[fileUid]?.data;
  const location = useLocation();
  const navigate = useNavigate();

  const query = useCallback(i => {
    const q = fileUid ? paragraphQuery(html, i) : null;
    return q && { ...q, activeTab: 'transcription', source_language: markup.language };
  }, [fileUid, html, markup?.language]);

  const toText = useCallback(i => {
    const q = query(i);
    if (!q) return;
    navigate({ search: `?${stringify({ ...getQuery(location), ...q })}` });
  }, [query, navigate, location]);

  const shareUrl = useCallback((i, time) => {
    const q = query(i);
    if (!q || typeof window === 'undefined') return null;
    const { origin, pathname } = window.location;
    const { language }         = splitPathByLanguage(pathname);
    const { mediaType }        = getQuery(location);
    return `${origin}${pathname}?${stringify({
      sstart   : toHumanReadableTime(time),
      mediaType,
      shareLang: language,
      ...q
    })}`;
  }, [query, location]);

  return { enabled: !!(fileUid && html), toText, shareUrl };
};

/**
 * A link into the transcript (srchstart + source_language) opened the Transcription tab on another language's
 * file, or on none (the user's content languages have no transcript): switch it to the markup's language,
 * where the paragraph is. Mount once on the lesson page.
 */
export const useTranscriptLanguageForLinks = markup => {
  const subject  = useSelector(textPageGetSubjectSelector);
  const file     = useSelector(textPageGetFileSelector);
  const location = useLocation();
  const dispatch = useDispatch();

  const { activeTab, srchstart, source_language } = getQuery(location);
  const wanted = markup?.transcript?.file_uid && source_language === markup.language ? markup.language : null;

  useEffect(() => {
    if (!wanted || activeTab !== 'transcription' || !srchstart) return;
    if (subject?.id !== markup.uid || file?.language === wanted) return;
    if (!(subject.languages || []).includes(wanted)) return;
    dispatch(textPageActions.changeLanguage(wanted));
  }, [wanted, activeTab, srchstart, subject?.id, subject?.languages, file?.language, markup?.uid, dispatch]);
};
