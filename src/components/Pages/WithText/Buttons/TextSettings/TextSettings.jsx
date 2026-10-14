import { Popover } from '@headlessui/react';

import ZoomSizeBtns from './ZoomSizeBtns';
import FontTypeBtn from './FontTypeBtn';
import ThemeBtn from './ThemeBtn';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';
import { textPageGetFileSelector } from '../../../../../redux/selectors';
import { useSelector } from 'react-redux';

const TextSettings = ({ popPos = 'bottom' }) => {
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
          {/* Semantic "basic flowing popup" with "fluid item menu" rows; menu order stays LTR as on prod */}
          <Popover.Panel
            className="z-10 w-[204px] bg-white rounded-[4px] shadow-[0_2px_4px_0_rgba(34,36,38,0.12),0_2px_10px_0_rgba(34,36,38,0.15)] font-lato text-[16px] text-black/87"
            anchor={{ to: popPos, gap: 21 }}
            dir="ltr"
          >
            <div className="flex">
              <ZoomSizeBtns />
            </div>
            <div className="flex border-t border-[rgba(34,36,38,0.1)]">
              <FontTypeBtn />
            </div>
            <div className="flex border-t border-[rgba(34,36,38,0.1)]">
              <ThemeBtn />
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default TextSettings;
