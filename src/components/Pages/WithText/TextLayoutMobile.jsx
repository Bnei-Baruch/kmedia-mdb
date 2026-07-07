import { useRef } from 'react';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import TextContentMobile from './Content/TextContentMobile';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import { clsx } from 'clsx';
import StickyToolbarMobile, { StickyBreadcrumbMobile } from './StickyToolbarMobile';
import { useSelector } from 'react-redux';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import ScrollToTopBtn from './Buttons/ScrollToTopBtn';
import { getWipErr } from '../../shared/WipErr/WipErr';
import {
  textPageGetSettings,
  textPageGetSubjectSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import { LANGUAGE_LONG_TRANSLATION } from '../../../helpers/consts';

const TextLayoutMobile = props => {
  const {
    toolbar = null,
    toc = null,
    prevNext = null,
    breadcrumb = null,
    playerPage = false,
    id,
  } = props;

  const ref = useRef();

  const { theme } = useSelector(textPageGetSettings);
  const subject = useSelector(textPageGetSubjectSelector);
  const uiLang = useSelector(settingsGetUILangSelector);
  const isLongTranslation = LANGUAGE_LONG_TRANSLATION.includes(uiLang);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);
  useInitTextUrl(null, !playerPage);

  const wipErr = getWipErr(wip, null);
  if (wipErr) return wipErr;

  return (
    <div
      ref={ref}
      className={clsx(
        `is-mobile text_layout is-${theme}`,
        { 'stick_toolbar_long_translation': isLongTranslation }
      )}
    >
      <StickyToolbarMobile toolbar={toolbar} playerPage={playerPage} slot="top" />
      <div className="text_mobile_padding">
        <ScrollToTopBtn />
        <StickyBreadcrumbMobile breadcrumb={breadcrumb} />
        <TagsByUnit id={subject.id}></TagsByUnit>
        <AudioPlayer />
        <TextContentMobile playerPage={playerPage} />
        {prevNext}
      </div>
      <StickyToolbarMobile toolbar={toolbar} playerPage={playerPage} slot="bottom" />
      {toc}
    </div>
  );
};

export default TextLayoutMobile;
