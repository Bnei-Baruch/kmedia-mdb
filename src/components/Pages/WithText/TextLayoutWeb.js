import React, { useRef, useContext } from 'react';
import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import NoteItemSticky from './Notes/NoteItemSticky';
import NoteConfirmRemove from './Notes/NoteConfirmRemove';
import NoteItemModal from './Notes/NoteItemModal';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import SearchOnPageBar from './SearchOnPageBar';
import WipErr from '../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  textPageGetUrlInfoSelector,
  textPageGetScrollDirSelector,
  textPageGetTextOnlySelector,
  textPageGetIsSearchSelector
} from '../../../redux/selectors';
import ScrollToTopBtn from './Buttons/ScrollToTopBtn';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useFetchNotes } from './Notes/useFetchNotes';

const TextLayoutWeb = props => {
  const {
    toolbar    = null,
    toc        = null,
    prevNext   = null,
    breadcrumb = null,
    playerPage = false,
    id
  } = props;

  const ref   = useRef();
  const { t } = useTranslation();

  const scrollDir          = useSelector(textPageGetScrollDirSelector);
  const subject            = useSelector(textPageGetSubjectSelector);
  const hasSel             = !!useSelector(textPageGetUrlInfoSelector).select;
  const { theme }          = useSelector(textPageGetSettings);
  const textOnly           = useSelector(textPageGetTextOnlySelector);
  const isSearch           = useSelector(textPageGetIsSearchSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);
  useInitTextUrl(null, !playerPage);
  useFetchNotes();

  const wipErr = WipErr({ wip, err: null, t });
  if (wipErr) return wipErr;

  const renderToolbar = () => (
    <div className={
      clsx('stick_toolbar no_print', {
        'stick_toolbar_unpinned': scrollDir === 1 || scrollDir === 2,
        'stick_toolbar_pinned': scrollDir === -1,
        'stick_toolbar_fixed': hasSel
      })
    }>
      {breadcrumb}
      {toolbar}
    </div>
  );
  const renderSearch  = () => (
    <div className={
      clsx('stick_toolbar no_print stick_toolbar_fixed', {
        'stick_toolbar_unpinned': scrollDir !== -1,
        'stick_toolbar_pinned': scrollDir === -1
      })}>
      <div className={
        clsx('no-margin-top', {
          'text_align_to_text': (!isMobileDevice),
          'text_align_to_text_text_only': textOnly && (!isMobileDevice)
        })}>
        <SearchOnPageBar />
      </div>
    </div>
  );

  return (
    <div className={`is-web text_layout is-${theme}${!breadcrumb ? '' : ' with_breadcrumb'}`} ref={ref}>
      {toc}
      {!isSearch ? renderToolbar() : renderSearch()}
      <div className={clsx({
        'text_align_to_text': (!isMobileDevice),
        'text_align_to_text_text_only': textOnly && (!isMobileDevice)
      })}>
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
