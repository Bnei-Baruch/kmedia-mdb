import React, { useRef } from 'react';
import { Container } from 'semantic-ui-react';
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
  textPageGetSubjectSelector
} from '../../../redux/selectors';
import TagsByUnit from '../../shared/TagsByUnit';
import AudioPlayer from '../../shared/AudioPlayer';

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

  const { theme } = useSelector(textPageGetSettings);
  const scrollDir = useSelector(textPageGetScrollDirSelector);
  const subject   = useSelector(textPageGetSubjectSelector);

  const wip = useTextSubject(id);
  useInitTextSettings();
  useScrollBehavior(ref);

  const wipErr = WipErr({ wip, err: null, t });
  if (wipErr) return wipErr;

  const getToolbar = () => (
    <div
      className={
        clsx('stick_toolbar no_print', {
          'stick_toolbar_unpinned': scrollDir === 1,
          'stick_toolbar_pinned': scrollDir === -1,
          'stick_toolbar_on_end': scrollDir === 2,
          'stick_bottom': !playerPage
        })
      }>
      <SearchOnPageBar />
      {toolbar}
    </div>
  );

  return (
    <div className={`is-mobile text_layout is-${theme}`} ref={ref}>
      {breadcrumb}
      {playerPage && getToolbar()}
      <Container className="padded">
        {
          !playerPage && (
            <div className="text_align_to_text">
              <TagsByUnit id={subject.id}></TagsByUnit>
              <AudioPlayer />
            </div>
          )
        }
        <TextContentMobile />
        {prevNext}
      </Container>
      {toc}
      {(!playerPage) && getToolbar()}
    </div>
  );
};

export default TextLayoutMobile;
