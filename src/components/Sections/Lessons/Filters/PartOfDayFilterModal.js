import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, List, Modal } from 'semantic-ui-react';

import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE, CT_DAILY_LESSON, FN_PART_OF_DAY } from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import { actions } from '../../../../redux/modules/filters';
import {
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  settingsGetUIDirSelector,
  settingsGetLeftRightByDirSelector,
  filtersAsideGetTreeSelector
} from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import PartOfDayItem from './PartOfDayItem';

const PartOfDayFilterModal = ({ namespace, ct }) => {
  const [open, setOpen] = useState(false);
  const { t }           = useTranslation();

  const uiDir        = useSelector(settingsGetUIDirSelector);
  const leftRight    = useSelector(settingsGetLeftRightByDirSelector);
  const stat         = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);

  const selectedCTFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE));
  const selectedCT        = useMemo(() => selectedCTFilters?.values || [], [selectedCTFilters]);
  const selectedDayPart   = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PART_OF_DAY))?.values;
  const itemsDayPart = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_PART_OF_DAY));
  const toggleOpen = () => setOpen(!open);

  const dispatch       = useDispatch();
  const handleSelectCt = (e, { checked }) => {
    const val = [...selectedCT].filter(x => x !== ct);
    if (checked) {
      val.push(ct);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, ct));
  };

  return (
    <>
      <List.Item key={`${FN_COLLECTION_MULTI}_${ct}`} disabled={stat === 0} className="filters-aside-ct">
        <List.Content className="stat" floated="right">
          {`(${stat})`}
        </List.Content>
        <Checkbox
          label={t(`filters.content-types.${CT_DAILY_LESSON}`)}
          checked={selectedCT.includes(ct)}
          onChange={handleSelectCt}
          indeterminate={!selectedCT.includes(ct) && !isEmpty(selectedDayPart)}
          disabled={stat === 0}
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${leftRight}`}
          onClick={toggleOpen}
          size="medium"
          disabled={stat === 0}
        />
      </List.Item>
      <Modal
        open={open}
        dir={uiDir}
        onClose={toggleOpen}
        className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
        closeIcon={<Icon name="times circle outline"/>}
        size="fullscreen"
      >
        <Modal.Header className="no-border nowrap">
          {t(`filters.content-types.${ct}`)}
        </Modal.Header>
        <Modal.Content scrolling>
          {itemsDayPart?.map(dayPart => <PartOfDayItem namespace={namespace} dayPart={dayPart} key={dayPart}/>)}
        </Modal.Content>
        <Modal.Actions>
          <Button primary content={t('buttons.close')} onClick={toggleOpen}/>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default PartOfDayFilterModal;
