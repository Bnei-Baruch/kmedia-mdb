import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';

import { textPageGetTocIsActiveSelector, textPageGetSubjectSelector } from '../../../../../redux/selectors';
import { actions } from '../../../../../redux/modules/textPage';
import TOCControl from '../../../../Sections/Source/TOC/TOCControl';

const PageWithPlayerTOC = ({ cus, onClick, textKey }) => {
  const tocIsActive = useSelector(textPageGetTocIsActiveSelector);
  const { id }      = useSelector(textPageGetSubjectSelector);

  const dispatch = useDispatch();

  if (cus?.length < 2) return null;

  const handleClick = cuId => {
    dispatch(actions.setTocIsActive());
    onClick(cuId);
  };

  return (
    <div className={clsx('toc no_print', { 'toc_active': tocIsActive })}>
      <TOCControl textKey={textKey}/>
      <div className="p-0">
        {
          cus.map(cu => (
            <div
              key={cu.id}
              onClick={() => handleClick(cu.id)}
              className="player_page_source_toc_item toc_single_level"
            >
              <div className={clsx('title', { 'active': cu.id === id })}>
                {cu.name}
              </div>
            </div>
          )
          )
        }
      </div>
    </div>
  );
};

export default PageWithPlayerTOC;
