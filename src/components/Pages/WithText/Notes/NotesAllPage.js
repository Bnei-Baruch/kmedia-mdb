import React, { useEffect, useState, useMemo } from 'react';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import NotesByPos from './NotesByPos';
import { useNodeHighlight } from './useNodeHighlight';
import { selectors as textPage } from '../../../../redux/modules/textPage';

const NotesAllPage = () => {
  const id      = useSelector(state => textPage.getSubject(state.textPage).id);
  const ids     = useSelector(state => selectors.getList(state.notes));
  const getById = useSelector(state => selectors.getById(state.notes, id));
  const _ids    = useMemo(() => {
    return ids
      .map(id => getById[id])
      .filter(({ properties: p }) => !p || (!p.srchstart && !p.srchend))
      .map(n => n.id);
  }, [getById, ids]);

  if (_ids.length === 0) return null;

  return (<NotesByPos ids={_ids} pos={0} />);
};

export default NotesAllPage;
