import React, { useEffect, useState } from 'react';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import NotesByPos from './NotesByPos';
import { useNodeHighlight } from './useNodeHighlight';

const NoteMarks = () => {
  const ids                 = useSelector(state => selectors.getList(state.notes));

  return (<NotesByPos key={0} ids={ids} pos={'none'} />  );
};

export default NoteMarks;
