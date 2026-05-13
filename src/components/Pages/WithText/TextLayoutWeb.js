import React, { useRef, useContext } from 'react';
import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import { clsx } from 'clsx';
import { useSelector } from 'react-redux';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import NoteItemSticky from './Notes/NoteItemSticky';
import NoteConfirmRemove from './Notes/NoteConfirmRemove';
import NoteItemModal from './Notes/NoteItemModal';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import SearchOnPageBar from './SearchOnPageBar';
import { getWipErr } from '../../shared/WipErr/WipErr';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  textPageGetUrlInfoSelector,
  textPageGetScrollDirSelector,
  textPageGetAdditionsModeSelector,
  textPageGetIsSearchSelector
} from '../../../redux/selectors';
import ScrollToTopBtn from './Buttons/ScrollToTopBtn';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useFetchNotes } from './Notes/useFetchNotes';
import { TEXT_PAGE_ADDITIONS_MODS } from '../../../helpers/consts';

const TextLayoutWeb = props => {
  const {
    toolbar = null,
    toc = null,
    prevNext = null,
    breadcrumb = null,
    playerPage = false,
    id
  } = props;

  const ref = useRef();

  const scrollDir = useSelector(textPageGetScrollDirSelector);
  const subject = useSelector(textPageGetSubjectSelector);
  const hasSel = !!useSelector(textPageGetUrlInfoSelector).select;
  const { theme } = useSelector(textPageGetSettings);
  const additionsMode = useSelector(textPageGetAdditionsModeSelector);
  const isSearch = useSelector(textPageGetIsSearchSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);
  useInitTextUrl(null, !playerPage);
  useFetchNotes();

  const wipErr = getWipErr(wip, null);
  if (wipErr) return wipErr;

  const renderToolbar = () => (
    <div className={
      clsx('stick_toolbar no_print', {
        'stick_toolbar_unpinned': scrollDir === 1 || scrollDir === 2,
        'stick_toolbar_pinned': scrollDir === -1,
        'stick_toolbar_fixed': hasSel,
        'text_selected': hasSel
      })
    }>
      {breadcrumb}
      {toolbar}
    </div>
  );
  const renderSearch = () => (
    <div className={
      clsx('stick_toolbar no_print stick_toolbar_fixed', {
        'stick_toolbar_unpinned': scrollDir !== -1,
        'stick_toolbar_pinned': scrollDir === -1
      })}>
      <div className='mx-auto px-2 flex justify-center max-w[700px] w-full'>
        <SearchOnPageBar />
      </div>
    </div>
  );

  return (
    <div
      className={`is-web text_layout is-${theme}${!breadcrumb ? '' : ' with_breadcrumb'}`}
      ref={ref}
      id="text_layout"
    >
      {toc}
      {!isSearch ? renderToolbar() : renderSearch()}
      <div className='mx-auto px-2 flex justify-start max-w-[650px] w-full'>
        <TagsByUnit id={subject.id}></TagsByUnit>
        <AudioPlayer />
      </div>
      <TextContentWeb playerPage={playerPage} />
      {prevNext}

      <NoteItemSticky />
      <NoteItemModal />
      <NoteConfirmRemove />
      <ScrollToTopBtn />
    </div>
  );
};

export default TextLayoutWeb;
