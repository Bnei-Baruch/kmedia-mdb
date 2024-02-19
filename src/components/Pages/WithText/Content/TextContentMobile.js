import React from 'react';
import { useSelector } from 'react-redux';

import ContentHtml from './ContentHtml';
import { textPageGetSettings, textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { physicalFile } from '../../../../helpers/utils';
import PDF from '../../../shared/PDF/PDF';
import { startsFrom } from '../../../shared/PDF/helper';
import NotFound from '../../../shared/NotFound';

const TextContentMobile = ({ playerPage }) => {
  const { fontType, zoomSize } = useSelector(textPageGetSettings);
  const file                   = useSelector(textPageGetFileSelector);
  const subject                = useSelector(textPageGetSubjectSelector);

  if (!file)
    return <NotFound textKey={playerPage && 'materials.transcription.no-content'} />;

  const { isPdf } = file;
  if (isPdf === undefined)
    return null;

  return (
    <div className={`is-${fontType} zoom_size_${isPdf ? 2 : zoomSize} webkit_text_size`}>
      <div className="font_settings text__content">
        {
          !isPdf ? (
            <div className="position_relative">
              <ContentHtml />
            </div>
          ) : (
            <PDF
              pdfFile={physicalFile(file)}
              startsFrom={startsFrom(subject.id) || 1}
            />
          )
        }
      </div>
    </div>
  );
};

export default TextContentMobile;
