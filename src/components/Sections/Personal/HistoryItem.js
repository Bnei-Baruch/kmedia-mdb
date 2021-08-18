import { useDispatch } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { imageByUnit } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../helpers/consts';
import { Button, Card, Header } from 'semantic-ui-react';
import UnitLogo from '../../shared/Logo/UnitLogo';
import React from 'react';

export const HistoryItem = ({ data: { item: history, unit }, t }) => {
  const dispatch         = useDispatch();
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  const remove = () => dispatch(actions.remove(MY_NAMESPACE_HISTORY, { ids: [history.id] }));

  return (
    <Card raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Button floated={'right'} size={'tiny'} icon={'remove'} onClick={remove} />
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${t('constants.content-types.' + unit.content_type)}`} />
        <Header size="tiny" floated="left">{unit.name}</Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('personal.viewedAt')} - ${t('values.date', { date: history.created_at })}`} />
      </Card.Content>
    </Card>
  );
};
