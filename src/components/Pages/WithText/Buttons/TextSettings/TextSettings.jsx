import React from 'react';
import { Popover } from '@headlessui/react';

import ZoomSizeBtns from './ZoomSizeBtns';
import FontTypeBtn from './FontTypeBtn';
import ThemeBtn from './ThemeBtn';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { textPageGetFileSelector } from '../../../../../redux/selectors';
import { useSelector } from 'react-redux';

const TextSettings = () => {
  const noFile = !useSelector(textPageGetFileSelector);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as="div">
            <ToolbarBtnTooltip
              textKey="text-settings"
              active={open}
              disabled={noFile}
              icon={<span className="material-symbols-outlined">text_fields</span>}
            />
          </Popover.Button>
          <Popover.Panel className="sources-settings absolute z-10 mt-2">
            <div className="flex">
              <ZoomSizeBtns />
            </div>
            <div className="flex">
              <FontTypeBtn />
            </div>
            <div className="flex">
              <ThemeBtn />
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default TextSettings;
