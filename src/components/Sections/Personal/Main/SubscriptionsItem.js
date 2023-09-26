import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Button, Card, Confirm, Header } from 'semantic-ui-react';

import { actions } from '../../../../../lib/redux/slices/mySlice/mySlice';
import { selectors as mdb } from '../../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { actions as statsActions, selectors as stats } from '../../../../redux/modules/stats';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_SUBSCRIPTIONS, SECTIONS_LINK_BY_CU_CONTENT_TYPE } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import { getMyItemKey } from '../../../../helpers/my';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';

export const SubscriptionsItem = ({ item, t }) => {
  const [confirm, setConfirm] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { key } = getMyItemKey(MY_NAMESPACE_SUBSCRIPTIONS, item);

  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, item.collection_uid));
  const cuStats    = useSelector(state => stats.getCUStats(state.stats, key));

  const uiDir = useSelector(state => settings.getUIDir(state.settings));

  const dispatch = useDispatch();
  const remove   = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { id: item.id, key }));

  useEffect(() => {
    if (item) {
      let start = moment(item.updated_at || item.created_at);
      const now = moment(Date.now());
      const end = moment(Date.now()).add(1, 'd');
      if (start.isSame(now, 'day')) {
        start = end;
      }

      const params = {
        start_date: start.format('YYYY-MM-DD'),
        end_date: end.format('YYYY-MM-DD'),
        count_only: true
      };
      if (item.collection_uid) params.collection = [item.collection_uid];
      if (item.content_type) params.content_type = [item.content_type];

      dispatch(statsActions.fetchCUStats(key, params));
    }
  }, [item, dispatch, key]);

  let logo, title, to;
  if (item.collection_uid) {
    logo  = <UnitLogo collectionId={collection?.id} width={isMobileDevice ? 300 : 700} />;
    title = collection?.name;
    to  = canonicalLink(collection);
  } else {
    logo  = <UnitLogo unitId={item.content_unit_uid} width={isMobileDevice ? 300 : 700} />;
    title = t(`constants.content-types.${item.content_type}`);
    to  = { pathname: `/${SECTIONS_LINK_BY_CU_CONTENT_TYPE[item.content_type]}` };
  }

  return (
    <Card raised color={cuStats?.data?.total ? 'red' : 'green'}>
      {logo}
      <Card.Content>
        <Header size="medium" className="no-margin-top">
          <Link to={to}>
            {title}
          </Link>
        </Header>
        <Card.Meta content={`${t('personal.subsNewUnits')} - ${cuStats?.data?.total || 0}`} />
      </Card.Content>
      <Card.Content extra textAlign="center">
        <Confirm
          size="tiny"
          open={confirm}
          onCancel={handleConfirmCancel}
          onConfirm={handleConfirmSuccess}
          cancelButton={t('buttons.cancel')}
          confirmButton={t('buttons.apply')}
          content={t('personal.confirmUnsubscribe', { name: title })}
          dir={uiDir}
        />
        <Button
          basic
          size="large"
          content={t('personal.unsubscribe')}
          onClick={remove}
          color="grey"
          className="uppercase"
        />
      </Card.Content>
    </Card>
  );
};
