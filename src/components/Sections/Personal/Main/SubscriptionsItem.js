import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Header } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { actions as mdbActions, selectors as mdb, selectors as mdbSelectors } from '../../../../redux/modules/mdb';
import { MY_NAMESPACE_SUBSCRIPTIONS, SECTIONS_LINK_BY_CU_CONTENT_TYPE } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import { imageByUnit } from '../../../../helpers/utils';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import moment from 'moment';
import { Link } from 'react-router-dom';

export const SubscriptionsItem = ({ item, t }) => {
  const namespace  = `${MY_NAMESPACE_SUBSCRIPTIONS}_${item.id}`;
  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, item.collection_uid));
  const unitCount  = useSelector(state => mdbSelectors.getCountCu(state.mdb, namespace));

  const dispatch = useDispatch();
  const remove   = () => dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { ids: [item.id] }));

  useEffect(() => {
    const params = {
      start_date: moment(item.updated_at).format('YYYY-MM-DD'),
      end_date: moment(Date.now()).add(1, 'd').format('YYYY-MM-DD')
    };
    if (item.collection_uid) params.collections = [item.collection_uid];
    if (item.content_type) params.content_types = [item.content_type];

    dispatch(mdbActions.countCU(namespace, params));
  }, [item.id]);

  let logo, title, link;
  if (item.collection_uid) {
    logo  =
      <UnitLogo collectionId={collection.id} fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?url=http%3A%2F%2Flocalhost%2Fassets%2Fapi%2Fthumbnail%2FEvPTLpdf&width=520&stripmeta=true'} />;
    title = collection.name;
    link  = canonicalLink(collection);
  } else {
    logo  =
      <UnitLogo unitId={item.content_unit_uid} fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?url=http%3A%2F%2Flocalhost%2Fassets%2Fapi%2Fthumbnail%2FEvPTLpdf&width=520&stripmeta=true'} />;
    title = t(`constants.content-types.${item.content_type}`);
    link  = '/' + SECTIONS_LINK_BY_CU_CONTENT_TYPE[item.content_type];
  }

  return (
    <Card raised color={unitCount ? 'red' : 'green'}>
      {logo}
      <Card.Content>
        <Header size="medium" className="no-margin-top">
          <Link to={link}>
            {title}
          </Link>
        </Header>
        <Card.Description content={`${t('personal.viewedAt')} - ${t('values.date', { date: item.updated_at })}`} />
        <Card.Meta content={`${t('personal.subsNewUnits')} - ${unitCount}`} />
      </Card.Content>
      <Card.Content extra textAlign="center">
        <Button
          basic
          size="large"
          content={t('personal.unsubscribe')}
          onClick={remove}
          color="grey"
        />
      </Card.Content>
    </Card>
  );
};
