import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { selectors as settings } from '../../../redux/modules/settings';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import LibrarySettings from './LibrarySettings';
import Share from './Share';


const LibraryBar = ({ fontSize = 0, isReadable = false, handleIsReadable, handleSettings, handleTocIsActive = null }) => {
  const language = useSelector(state => settings.getLanguage(state.settings));
  const isRtl    = isLanguageRtl(language);
  const position = isRtl ? 'left' : 'right';

  const print = () => window.print();

  return (
    <div className="source__header-toolbar">
      <Button compact size="small" className="mobile-hidden" icon="print" onClick={print} />
      {/* a portal is used to put the download button here in this div */}
      <div id="download-button" />
      <LibrarySettings fontSize={fontSize} handleSettings={handleSettings} />
      <Button compact size="small" icon={isReadable ? 'compress' : 'expand'} onClick={handleIsReadable} />
      { handleTocIsActive &&
        <Button compact size="small" icon="list layout" onClick={handleTocIsActive}
          className="computer-hidden large-screen-hidden widescreen-hidden" />
      }
      <Share position={position} />
    </div>
  );
};

LibraryBar.propTypes = {
  handleIsReadable: PropTypes.func,
  handleSettings: PropTypes.func,
  handleTocIsActive: PropTypes.func,
  isReadable: PropTypes.bool,
  fontSize: PropTypes.number
}

export default LibraryBar;
