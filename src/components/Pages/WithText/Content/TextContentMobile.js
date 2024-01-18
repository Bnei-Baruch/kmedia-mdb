import React from 'react';
import ContentHtml from './ContentHtml';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import TagsByUnit from '../../../shared/TagsByUnit';
import AudioPlayer from '../../../shared/AudioPlayer';
import { textPageGetSettings, textPageGetSubjectSelector } from '../../../../redux/selectors';

const TextContentMobile = () => {
  const { fontType, theme, zoomSize } = useSelector(textPageGetSettings);
  const subject                       = useSelector(textPageGetSubjectSelector);

  return (
    <div className={`is-${theme} is-${fontType}`} style={{ zoom: zoomSize }}>
      <div className="font_settings text__content">
        <TagsByUnit id={subject.id}></TagsByUnit>
        <AudioPlayer />
        <div className="position_relative">
          <ContentHtml />
        </div>
      </div>
    </div>
  );
};

export default TextContentMobile;
