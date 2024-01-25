import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';

import { textPageGetTocIsActiveSelector, textPageGetSubjectSelector } from '../../../../../../redux/selectors';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';
import { actions } from '../../../../../../redux/modules/textPage';

const SourceTabTOC = ({ cus, onClick }) => {
  const tocIsActive = useSelector(textPageGetTocIsActiveSelector);
  const { id }      = useSelector(textPageGetSubjectSelector);

  const dispatch = useDispatch();

  if (cus.length < 2) return null;
  const handleClick = cuId => {
    dispatch(actions.setTocIsActive());
    onClick(cuId);
  };

  return (
    <div className={clsx('player_page_source_toc no_print', { 'active': tocIsActive })}>
      <TocToggleBtn />
      <div>
        {
          cus.map(cu => (
            <div
              onClick={() => handleClick(cu.id)}
              className={clsx('player_page_source_toc_item', { 'active': cu.id === id })}
            >
              {cu.name}
            </div>
          )
          )
        }
      </div>
    </div>
  );
};

export default SourceTabTOC;
