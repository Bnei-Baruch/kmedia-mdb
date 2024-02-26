import React, { useRef } from 'react';
import { useTextSubject } from './hooks/useTextSubject';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import TextContentMobile from './Content/TextContentMobile';
import { useInitTextSettings } from './hooks/useInitTextSettings';
import clsx from 'clsx';
import SearchOnPageBar from './SearchOnPageBar';
import { useSelector } from 'react-redux';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import WipErr from '../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';
import {
  textPageGetSettings,
  textPageGetScrollDirSelector,
  textPageGetSubjectSelector,
  textPageGetIsSearchSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';
import { LANGUAGE_LONG_TRANSLATION } from '../../../helpers/consts';

const TextLayoutMobile = props => {
  const {
          toolbar    = null,
          toc        = null,
          prevNext   = null,
          breadcrumb = null,
          playerPage = false,
          id,
        } = props;

  const ref   = useRef();
  const { t } = useTranslation();

  const { theme }         = useSelector(textPageGetSettings);
  const scrollDir         = useSelector(textPageGetScrollDirSelector);
  const subject           = useSelector(textPageGetSubjectSelector);
  const isSearch          = useSelector(textPageGetIsSearchSelector);
  const uiLang            = useSelector(settingsGetUILangSelector);
  const isLongTranslation = LANGUAGE_LONG_TRANSLATION.includes(uiLang);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);
  useInitTextUrl(null, !playerPage);

  const wipErr = WipErr({ wip, err: null, t });
  if (wipErr) return wipErr;

  const renderToolbar = () => (
    <div
      className={
        clsx('stick_toolbar no_print', {
          'stick_toolbar_unpinned': scrollDir === 1,
          'stick_toolbar_pinned': scrollDir === -1,
          'stick_toolbar_on_end': scrollDir === 2,
          'stick_bottom': !playerPage,
          'stick_toolbar_long_translation': isLongTranslation,
        })
      }>
      {toolbar}
    </div>
  );

  const renderSearch = () => (
    <div className={'stick_toolbar no_print stick_toolbar_fixed stick_bottom'}>
      <SearchOnPageBar />
    </div>
  );

  return (
    <div
      ref={ref}
      className={clsx(
        `is-mobile text_layout is-${theme}`,
        { 'stick_toolbar_long_translation': isLongTranslation }
      )}
    >
      {(playerPage && !isSearch) && renderToolbar()}
      <div className="text_mobile_padding">
        {breadcrumb}
        <TagsByUnit id={subject.id}></TagsByUnit>
        <AudioPlayer />
        <TextContentMobile playerPage={playerPage} />
        {prevNext}
      </div>
      {isSearch && renderSearch()}
      {(!playerPage && !isSearch) && renderToolbar()}
      {toc}
    </div>
  );
};

export default TextLayoutMobile;
