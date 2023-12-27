import React from 'react';
import LabelMark from './LabelMark';

const LabelMarks = ({ labels, offsets }) => {

  return (
    <div className="label_marks">
      {labels.map(l => <LabelMark label={l} offset={offsets[l.id]} key={l.id} />)}
    </div>
  );
};

export default LabelMarks;
