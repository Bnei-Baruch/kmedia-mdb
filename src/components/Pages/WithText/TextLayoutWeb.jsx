import { useRef } from 'react';
import { useSelector } from 'react-redux';

import TextContentWeb from './Content/TextContentWeb';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import NoteItemSticky from './Notes/NoteItemSticky';
import NoteConfirmRemove from './Notes/NoteConfirmRemove';
import NoteItemModal from './Notes/NoteItemModal';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import StickyToolbar from './StickyToolbar';
import { getWipErr } from '../../shared/WipErr/WipErr';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import {
  textPageGetSettings,
  textPageGetSubjectSelector
} from '../../../redux/selectors';
import ScrollToTopBtn from './Buttons/ScrollToTopBtn';
import { useFetchNotes } from './Notes/useFetchNotes';

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

  const subject = useSelector(textPageGetSubjectSelector);
  const { theme } = useSelector(textPageGetSettings);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);
  useInitTextUrl(null, !playerPage);
  useFetchNotes();

  const wipErr = getWipErr(wip, null);
  if (wipErr) return wipErr;

  return (
    <div
      className={`is-web text_layout is-${theme}${!breadcrumb ? '' : ' with_breadcrumb'}`}
      ref={ref}
      id="text_layout"
    >
      {toc}
      <StickyToolbar breadcrumb={breadcrumb} toolbar={toolbar} />
      <div className='mx-auto px-2 max-w-[650px] w-full'>
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
