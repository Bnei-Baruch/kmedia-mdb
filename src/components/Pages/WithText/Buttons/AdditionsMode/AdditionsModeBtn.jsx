import React from 'react';
import { Popover } from '@headlessui/react';

import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import AdditionsMode from '../../../../../images/icons/AdditionsMode';
import AdditionsModeItems from './AdditionsModeItems';

const AdditionsModeBtn = () => (
  <Popover className="relative">
    {({ open }) => (
      <>
        <Popover.Button as="div">
          <ToolbarBtnTooltip
            textKey={'additions.review'}
            active={open}
            className="text_mark_on_select_btn no_stroke"
            icon={<AdditionsMode/>}
          />
        </Popover.Button>
        <Popover.Panel className="sources-settings absolute z-10 mt-2">
          <AdditionsModeItems/>
        </Popover.Panel>
      </>
    )}
  </Popover>
);

export default AdditionsModeBtn;
