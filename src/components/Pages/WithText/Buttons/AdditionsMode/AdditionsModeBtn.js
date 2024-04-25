import React, { useState } from 'react';
import { Popup } from 'semantic-ui-react';

import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import AdditionsMode from '../../../../../images/icons/AdditionsMode';
import AdditionsModeItems from './AdditionsModeItems';

const AdditionsModeBtn = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <Popup
      trigger={
        <div>
          <ToolbarBtnTooltip
            textKey={'additions.review'}
            active={open}
            className="text_mark_on_select_btn no_stroke"
            icon={<AdditionsMode/>}
          />
        </div>
      }
      on="click"
      position="bottom center"
      basic
      className="sources-settings"
      flowing
      hideOnScroll
      open={open}
      onClose={toggleOpen}
      onOpen={toggleOpen}
      offset={[0, 10]}
    >
      <Popup.Content>
        <AdditionsModeItems/>
      </Popup.Content>
    </Popup>
  );
};

export default AdditionsModeBtn;
