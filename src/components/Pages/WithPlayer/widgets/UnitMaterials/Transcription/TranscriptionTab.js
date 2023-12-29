import React from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import TranscriptionTabToolbarWeb from './TranscriptionTabToolbarWeb';

const TranscriptionTab = () => {
  const { id } = useParams();

  const toolbar = <TranscriptionTabToolbarWeb />;

  return (
    <div className="transition_tab">
      <TextLayoutWeb propId={id} toolbar={toolbar} />
    </div>
  );
};

export default TranscriptionTab;
