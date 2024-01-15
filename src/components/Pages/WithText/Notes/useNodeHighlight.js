import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectors as myNotes } from '../../../../redux/modules/myNotes';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { highlightByPrefixAndId, clearHighlightByStyle } from '../helper';

const idPrefixes = textMarksPrefixByType.note;

export const useNodeHighlight = () => {
  const node = useSelector(state => myNotes.getSelected(state.myNotes)) || false;

  useEffect(() => {
    if (!node) {
      clearHighlightByStyle();
    } else if (node.id > 0) {
      highlightByPrefixAndId(idPrefixes, node.id);
    }
  }, [node]);

  return null;
};
