import React, { useEffect } from 'react';
import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
import { useTextContent } from './Content/useTextContent';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../redux/modules/textPage';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import NoteItemSticky from './Notes/NoteItemSticky';
import NoteConfirmRemove from './Notes/NoteConfirmRemove';
import NoteItemModal from './Notes/NoteItemModal';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import PDF, { startsFrom } from '../../shared/PDF/PDF';
import { physicalFile } from '../../../helpers/utils';

let lastScrollTop = 0;

const TextLayoutWeb = ({ toolbar = null, toc = null, prevNext = null, breadcrumb = null, propId }) => {
  const scrollDir = useSelector(state => textPage.getScrollDir(state.textPage));
  const subject   = useSelector(state => textPage.getSubject(state.textPage));
  const hasSel    = !!useSelector(state => textPage.getUrlInfo(state.textPage)).select;
  const file      = useSelector(state => textPage.getFile(state.textPage));
  const scanInfo  = useSelector(state => textPage.getScanInfo(state.textPage));

  useInitTextUrl();
  useTextSubject(propId);
  useInitTextSettings();

  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st < 120) {
        dispatch(actions.setScrollDir(0));
      } else if (st > lastScrollTop) {
        dispatch(actions.setScrollDir(1));
      } else if (st + 5 < lastScrollTop) {
        dispatch(actions.setScrollDir(-1));
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const wipErr = useTextContent();
  if (wipErr) return wipErr;

  let pdf;
  if (file.isPdf) {
    pdf = file;
  } else if (scanInfo.on) {
    pdf = scanInfo.file;
  }

  return (
    <div className="is-web text_layout">
      {breadcrumb}
      {toc}
      <div className={
        clsx('stick_toolbar no_print', {
          'stick_toolbar_unpinned': scrollDir === 1,
          'stick_toolbar_pinned': scrollDir === -1,
          'stick_toolbar_fixed': hasSel,
        })
      }>
        {toolbar}
      </div>
      {
        !!pdf ? (
          <div className="text_align_to_text">
            <PDF
              pdfFile={physicalFile(pdf)}
              pageNumber={1}
              startsFrom={startsFrom(subject.id) || 1}
            />
          </div>
        ) : (
          <>
            <div className="text_align_to_text">
              <TagsByUnit id={subject.id}></TagsByUnit>
              <AudioPlayer />
            </div>
            <TextContentWeb />
            <NoteItemSticky />
            <NoteItemModal />
            <NoteConfirmRemove />
            {prevNext}
          </>
        )
      }
    </div>
  );
};

export default TextLayoutWeb;
