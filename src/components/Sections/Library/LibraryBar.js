import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import LibrarySettings from './LibrarySettings';
import Share from './Share';
import BookmarkButton from '../../shared/SaveBookmark/BookmarkButton';
import LabelButton from '../../shared/SelectTopicsModal/LabelButton';
import LessonsBySourceButton from './LessonsBySourceButton';
import { selectors as textFile, textFileSlice } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const LibraryBar = () => {
  const uiDir    = useSelector(state => settings.getUIDir(state.settings));
  const position = uiDir === 'rtl' ? 'left' : 'right';

  const isReadable = useSelector(state => textFile.getIsReadable(state.textFile));
  const dispatch   = useDispatch();

  const print             = () => window.print();
  const handleTocIsActive = () => dispatch(textFileSlice.actions.setTocIsActive());
  const handleIsReadable  = () => dispatch(textFileSlice.actions.setReadable());

  return (
    <div className="source__header-toolbar">
      <LessonsBySourceButton />
      <BookmarkButton />
      <LabelButton />
      <Button compact size="small" className="mobile-hidden" icon="print" onClick={print} />
      {/* a portal is used to put the download button here in this div */}
      <div id="download-button" />
      <LibrarySettings />
      <Button
        compact
        size="small"
        icon={isReadable ? 'compress' : 'expand'}
        onClick={handleIsReadable}
      />
      <Button
        compact size="small"
        icon="list layout"
        onClick={handleTocIsActive}
        className="computer-hidden large-screen-hidden widescreen-hidden"
      />

      <Share position={position} />
    </div>
  );
};

LibraryBar.propTypes = {
  handleIsReadable: PropTypes.func,
  handleSettings: PropTypes.func,
  handleTocIsActive: PropTypes.func,
  isReadable: PropTypes.bool,
  fontSize: PropTypes.number,
  source: PropTypes.object,
  label: PropTypes.object
};

export default LibraryBar;
