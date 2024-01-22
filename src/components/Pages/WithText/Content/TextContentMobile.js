import React from 'react';
import ContentHtml from './ContentHtml';
import { useSelector } from 'react-redux';
import TagsByUnit from '../../../shared/TagsByUnit';
import AudioPlayer from '../../../shared/AudioPlayer';
import { textPageGetSettings, textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { isEmpty, physicalFile } from '../../../../helpers/utils';
import PDF, { startsFrom } from '../../../shared/PDF/PDF';

const TextContentMobile = () => {
  const { fontType, theme, zoomSize } = useSelector(textPageGetSettings);
  const file                          = useSelector(textPageGetFileSelector);
  const subject                       = useSelector(textPageGetSubjectSelector);

  let pdf;
  if (isEmpty(file)) {
    return null;
  } else if (file.isPdf) {
    pdf = file;
  }

  return (
    <div className={`is-${theme} is-${fontType}`} style={{ zoom: zoomSize }}>
      <div className="font_settings text__content">
        {
          !!pdf ? (
            <PDF
              pdfFile={physicalFile(pdf)}
              pageNumber={1}
              startsFrom={startsFrom(subject.id) || 1}
            />
          ) : (
            <div className="position_relative">
              <ContentHtml />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TextContentMobile;
