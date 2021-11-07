import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import LibrarySettings from '../../../../Sections/Library/LibrarySettings';

const UnitBar = ({ fontSize = 0, handleSettings }) => {

  const print = () => window.print();

  return (
    <div className="source__header-toolbar">
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
