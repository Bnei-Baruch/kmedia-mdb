import React, { useEffect, useRef } from 'react';
import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
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
import SearchOnPageBar from './SearchOnPageBar';
import WipErr from '../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';

let lastScrollTop = 0;

const TextLayoutWeb = props => {
  const {
    toolbar    = null,
    toc        = null,
    prevNext   = null,
    breadcrumb = null,
    propId,
    playerPage = false,
  } = props;

  const ref   = useRef();
  const { t } = useTranslation();

  const scrollDir = useSelector(state => textPage.getScrollDir(state.textPage));
  const subject   = useSelector(state => textPage.getSubject(state.textPage));
  const hasSel    = !!useSelector(state => textPage.getUrlInfo(state.textPage)).select;
  const { theme } = useSelector(state => textPage.getSettings(state.textPage));

  useInitTextUrl();
  const wip = useTextSubject(propId);
  useInitTextSettings();

  console.log('not ssr text bug: TextLayoutWeb render', wip)
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st < ref.current?.offsetTop + 60) {
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
  }, [ref.current]);

  const wipErr = WipErr({ wip, err: null, t });
  if (wipErr) return wipErr;

  return (
    <div className={`is-web text_layout  is-${theme}`} ref={ref}>
      {toc}
      <div className={
        clsx('stick_toolbar no_print', {
          'stick_toolbar_unpinned': scrollDir === 1,
          'stick_toolbar_pinned': scrollDir === -1,
          'stick_toolbar_fixed': hasSel,
        })
      }>
        {breadcrumb}
        {toolbar}
        <SearchOnPageBar />
      </div>
      {
        !playerPage && (
          <div className="text_align_to_text margin-bottom-1em">
            <TagsByUnit id={subject.id}></TagsByUnit>
            <AudioPlayer />
          </div>
        )
      }
      <TextContentWeb />
      {prevNext}

      <NoteItemSticky />
      <NoteItemModal />
      <NoteConfirmRemove />
    </div>
  );
};

export default TextLayoutWeb;
