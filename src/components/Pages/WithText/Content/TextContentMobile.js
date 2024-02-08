import React from 'react';
import ContentHtml from './ContentHtml';
import { useSelector } from 'react-redux';
import { textPageGetSettings, textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { physicalFile } from '../../../../helpers/utils';
import PDF, { startsFrom } from '../../../shared/PDF/PDF';

const TextContentMobile = () => {
  const { fontType, zoomSize } = useSelector(textPageGetSettings);
  const file                   = useSelector(textPageGetFileSelector);
  const subject                = useSelector(textPageGetSubjectSelector);

  const { isPdf } = file;
  if (isPdf === undefined) {
    return null;
  }

  return (
    <div className={`is-${fontType} zoom_size_${zoomSize}`}>
      <div className="font_settings text__content">
        {
          !isPdf ? (
            <div className="position_relative">
              <ContentHtml />
            </div>
          ) : (
            <PDF
              pdfFile={physicalFile(file)}
              pageNumber={1}
              startsFrom={startsFrom(subject.id) || 1}
            />
          )
        }
      </div>
    </div>
  );
};

export default TextContentMobile;
