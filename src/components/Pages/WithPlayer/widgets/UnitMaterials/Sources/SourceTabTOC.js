import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { textPageGetTocIsActiveSelector, textPageGetSubjectSelector } from '../../../../../../redux/selectors';
import { actions } from '../../../../../../redux/modules/textPage';
import { Dropdown } from 'semantic-ui-react';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';

const SourceTabTOC = ({ cus, onClick }) => {
  const tocIsActive = useSelector(textPageGetTocIsActiveSelector);
  const { id }      = useSelector(textPageGetSubjectSelector);

  const dispatch = useDispatch();

  if (cus.length < 2) return null;
  const handleClick = cuId => {
    dispatch(actions.setTocIsActive());
    onClick(cuId);
  };

  const handleToggle = () => dispatch(actions.setTocIsActive());

  return (
    <Dropdown
      item
      icon={null}
      trigger={<TocToggleBtn withText={false}/>}
      open={tocIsActive}
      onClose={handleToggle}
    >
      <Dropdown.Menu>
        {
          cus.map(cu => (
            <Dropdown.Item
              key={cu.id}
              onClick={() => handleClick(cu.id)}
              active={cu.id === id}
              className="player_page_source_toc_item"
            >
              <a>
                {cu.name}
              </a>
            </Dropdown.Item>
          )
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SourceTabTOC;
