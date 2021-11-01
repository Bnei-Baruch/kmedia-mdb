import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Button, Card, Confirm, Header } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { actions as statsActions, selectors as stats } from '../../../../redux/modules/stats';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_SUBSCRIPTIONS, SECTIONS_LINK_BY_CU_CONTENT_TYPE } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import { getMyItemKey } from '../../../../helpers/my';

export const SubscriptionsItem = ({ item, t }) => {
  const [confirm, setConfirm] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { key } = getMyItemKey(MY_NAMESPACE_SUBSCRIPTIONS, item);

  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, item.collection_uid));
  const cuStats    = useSelector(state => stats.getCUStats(state.stats, key));

  const dispatch = useDispatch();
  const remove   = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { id: item.id }));

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
  }, [item, dispatch]);

  let logo, title, link;
  if (item.collection_uid) {
    logo  = <UnitLogo collectionId={collection?.id} width={isMobileDevice ? 300 : 520} />;
    title = collection?.name;
    link  = canonicalLink(collection);
  } else {
    logo  = <UnitLogo unitId={item.content_unit_uid} width={isMobileDevice ? 300 : 520} />;
    title = t(`constants.content-types.${item.content_type}`);
    link  = `/${SECTIONS_LINK_BY_CU_CONTENT_TYPE[item.content_type]}`;
  }

  return (
    <Card raised color={cuStats?.data?.total ? 'red' : 'green'}>
      {logo}
      <Card.Content>
        <Header size="medium" className="no-margin-top">
          <Link to={link}>
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
          content={t('personal.confirmUnsubscribe', { name: title })}
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
