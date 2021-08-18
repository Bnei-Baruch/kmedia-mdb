import React from 'react';
import { useDispatch } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { imageByUnit } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_SUBSCRIPTIONS } from '../../../helpers/consts';
import { Button, Card, Header } from 'semantic-ui-react';
import UnitLogo from '../../shared/Logo/UnitLogo';

export const SubscriptionsItem = ({ data: { item: sub, unit, collection }, t }) => {
  const dispatch = useDispatch();

  const remove = () => dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { ids: [sub.id] }));
  let logo, title;
  if (sub.collection_uid) {
    logo  = <UnitLogo width={512} collectionId={collection.id} />;
    title = collection.name;
  } else {
    const link             = canonicalLink(unit);
    const canonicalSection = imageByUnit(unit, link);
    logo                   = <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />;
    title                  = t(`constants.content-types.${sub.content_type}`);
  }

  return (
    <Card raised>
      {logo}
      <Card.Content>
        <Header size="tiny">{title}</Header>

        <Card.Meta content={`${t('personal.updatedAt')} - ${t('values.date', { date: sub.updated_at })}`} />
      </Card.Content>
      <Card.Content extra textAlign="center">
        <Button
          basic
          size="large"
          content={t('personal.unsubscribe')}
          onClick={remove}
          color={'grey'}
        />
      </Card.Content>
    </Card>
  );
};
