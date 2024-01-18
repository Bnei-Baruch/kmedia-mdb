import React, { useRef } from 'react';
import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import NoteItemSticky from './Notes/NoteItemSticky';
import NoteConfirmRemove from './Notes/NoteConfirmRemove';
import NoteItemModal from './Notes/NoteItemModal';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import SearchOnPageBar from './SearchOnPageBar';
import WipErr from '../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../helpers/utils';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector, textPageGetScrollDirSelector
} from '../../../redux/selectors';

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

  const scrollDir = useSelector(textPageGetScrollDirSelector);
  const subject   = useSelector(textPageGetSubjectSelector);
  const file      = useSelector(textPageGetFileSelector);
  const hasSel    = !!useSelector(textPageGetUrlInfoSelector).select;
  const { theme } = useSelector(textPageGetSettings);

  useInitTextUrl();
  const wip = useTextSubject(propId);
  useInitTextSettings();
  useScrollBehavior(ref);

  const wipErr = WipErr({ wip, err: null, t });
  if (wipErr) return wipErr;

  if (isEmpty(file)) return <h1>Not found</h1>;

  return (
    <div className={`is-web text_layout is-${theme}`} ref={ref}>
      {toc}
      <div className={
        clsx('stick_toolbar no_print', {
          'stick_toolbar_unpinned': scrollDir === 1,
          'stick_toolbar_pinned': scrollDir === -1,
          'stick_toolbar_fixed': hasSel,
          'stick_toolbar_no_breadcrumb': !breadcrumb
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
