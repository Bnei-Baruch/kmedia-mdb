import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import {
  CT_DAILY_LESSON,
  CT_LESSONS,
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE,
  FN_PART_OF_DAY
} from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import { actions } from '../../../../redux/modules/filters';
import {
  filtersAsideGetStatsSelector,
  filtersAsideGetTreeSelector,
  filtersGetFilterByNameSelector,
  settingsGetLeftRightByDirSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';
import PartOfDayItem from './PartOfDayItem';

const PartOfDayFilterModal = ({ namespace, ct }) => {
  const [open, setOpen] = useState(false);
  const { t }           = useTranslation();

  const uiDir     = useSelector(settingsGetUIDirSelector);
  const leftRight = useSelector(settingsGetLeftRightByDirSelector);
  const stat      = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);

  const selectedCTFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE));
  const selectedCT        = useMemo(() => selectedCTFilters?.values || [], [selectedCTFilters]);
  const selectedDayPart   = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PART_OF_DAY))?.values;
  const itemsDayPart      = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_PART_OF_DAY));
  const toggleOpen        = () => setOpen(!open);

  const dispatch       = useDispatch();
  const handleSelectCt = e => {
    const { checked } = e.target;
    const val = [...selectedCT].filter(x => !CT_LESSONS.includes(x));
    if (checked) {
      val.push(ct);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  const caretIcon = leftRight === 'right' ? 'arrow_right' : 'arrow_left';
  return (
    <>
      <div key={`${FN_COLLECTION_MULTI}_${ct}`} className={`filters-aside-ct flex items-center justify-between ${stat === 0 ? ' opacity-50 pointer-events-none' : ''}`}>
        <label className="flex items-center justify-between no-wrap gap-2">
          <input
            type="checkbox"
            ref={el => {
              if (el) el.indeterminate = !selectedCT.includes(ct) && !isEmpty(selectedDayPart);
            }}
            checked={selectedCT.includes(ct)}
            onChange={handleSelectCt}
            disabled={stat === 0}
          />
          {t(`filters.content-types.${CT_DAILY_LESSON}`)}
        </label>
        <span className="material-symbols-outlined text-blue-500 cursor-pointer text-2xl" onClick={toggleOpen}>
          {caretIcon}
        </span>
        <span className="stat">
          {`(${stat})`}
        </span>
      </div>
      <Dialog
        open={open}
        onClose={toggleOpen}
        className={clsx('filters_aside_tree_modal relative z-50', { [uiDir]: true })}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
          <DialogPanel className="w-full max-w-3xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b-0 no-border">
              <DialogTitle className="whitespace-nowrap">
                {t(`filters.content-types.${ct}`)}
              </DialogTitle>
              <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">cancel</span>
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-3 max-h-[60vh]">
              {itemsDayPart?.map(dayPart => <PartOfDayItem namespace={namespace} dayPart={dayPart} key={dayPart}/>)}
            </div>
            <div className="flex justify-end px-4 py-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={toggleOpen}>
                {t('buttons.close')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default PartOfDayFilterModal;
