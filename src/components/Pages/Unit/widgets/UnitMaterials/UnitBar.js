import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import LibrarySettings from '../../../../Sections/Library/LibrarySettings';
import BookmarkButton from '../../../../shared/SaveBookmark/BookmarkButton';

const UnitBar = ({ fontSize = 0, handleSettings, source }) => {

  const print = () => window.print();

  return (
    <div className="source__header-toolbar">
      {source && <BookmarkButton source={source} />}
      <Button compact size="small" className="mobile-hidden" icon="print" onClick={print} />
      {/* a portal is used to put the download button here in this div */}
      <div id="download-button" />
      <LibrarySettings fontSize={fontSize} handleSettings={handleSettings} />
    </div>
  );
};

UnitBar.propTypes = {
  handleSettings: PropTypes.func,
  fontSize: PropTypes.number
};

export default UnitBar;
