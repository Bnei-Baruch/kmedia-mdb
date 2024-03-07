import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { textPageGetSubjectSelector } from '../../../../../../redux/selectors';
import { Dropdown } from 'semantic-ui-react';
import ToolbarBtnTooltip from '../../../../WithText/Buttons/ToolbarBtnTooltip';

const SourceTabTOC = ({ cus, onClick }) => {
  const { id }          = useSelector(textPageGetSubjectSelector);
  const [open, setOpen] = useState(false);

  if (cus.length < 2) return null;
  const handleClick  = cuId => {
    onClick(cuId);
    setOpen(false);
  };
  const handleToggle = () => setOpen(!open);

  return (
    <Dropdown
      item
      icon={null}
      trigger={
        (
          <ToolbarBtnTooltip
            textKey="toc"
            active={open}
            icon={<span className="material-symbols-outlined">view_list</span>}
            onClick={handleToggle}
          />
        )
      }
      open={open}
      onClose={handleToggle}
      onOpen={handleToggle}
    >
      <Dropdown.Menu>
        {
          cus.map(cu => (
              <Dropdown.Item
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
