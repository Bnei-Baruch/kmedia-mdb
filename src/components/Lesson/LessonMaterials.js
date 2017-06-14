import React from 'react';
import { Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';

const LessonMaterials = (props) => {
  return (
    <Menu
      secondary
      pointing
      color="blue"
      className="index-filters"
      style={{
        backgroundColor: 'gray',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
      }}
    >
      <Menu.Item name="item-summary">Summary</Menu.Item>
      <Menu.Item name="item-transcription">Transcription</Menu.Item>
      <Menu.Item name="item-sources">Sources</Menu.Item>
      <Menu.Item name="item-sketches">Sketches</Menu.Item>
    </Menu>
  );
};

LessonMaterials.propTypes = {
  lesson: shapes.LessonPart,
};

LessonMaterials.defaultProps = {
  lesson: undefined,
};

export default LessonMaterials;
