import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { actions } from '../../../redux/modules/search';

const menuItemClass = 'block w-full px-3 py-1.5 text-start text-[13px] data-focus:bg-black/5 cursor-pointer';

/**
 * Editable chip: [Prefix: A › B ✕].
 * Click on the label opens a menu: broaden to an ancestor (tree filters), search as text, remove.
 */
const SmartFilterChip = ({ chip, onRemove, onBroaden }) => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { name, value, mention, segments } = chip;
  const ancestors = segments.slice(0, -1);
  const label     = segments.map(s => s.label).join(' › ');

  const toText = () => dispatch(actions.smartChipToText({ name, value }));

  return (
    <span className="smart-chip inline-flex shrink-0 items-center rounded-full bg-[#e8f1fa] text-[#134d78] text-[13px] leading-[20px] whitespace-nowrap ps-2.5 pe-1">
      <Menu>
        <MenuButton className="max-w-60 truncate cursor-pointer" title={label}>
          <span className="text-black/60">{t(`filters.aside-filter.${name}`)}: </span>
          {label}
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="z-1899 mt-1 min-w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 text-black/87"
        >
          {ancestors.map(a => (
            <MenuItem key={a.id}>
              <button type="button" className={menuItemClass} onClick={() => onBroaden(chip, a.id)}>
                {t('search.smart.broaden', { name: a.label })}
              </button>
            </MenuItem>
          ))}
          {mention && (
            <MenuItem>
              <button type="button" className={menuItemClass} onClick={toText}>
                {t('search.smart.asText', { text: mention })}
              </button>
            </MenuItem>
          )}
          <MenuItem>
            <button type="button" className={menuItemClass} onClick={() => onRemove(chip)}>
              {t('search.smart.remove')}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <button
        type="button"
        aria-label={t('search.smart.remove')}
        onClick={() => onRemove(chip)}
        className="material-symbols-outlined text-[16px]! leading-none! ms-1 text-black/40 hover:text-black/70 cursor-pointer"
      >
        close
      </button>
    </span>
  );
};

export default SmartFilterChip;
