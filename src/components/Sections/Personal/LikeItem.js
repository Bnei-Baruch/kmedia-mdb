import { useDispatch } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { imageByUnit } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_LIKES } from '../../../helpers/consts';
import { Button, Card, Header } from 'semantic-ui-react';
import UnitLogo from '../../shared/Logo/UnitLogo';
import React from 'react';
import { Link } from 'react-router-dom';

export const LikeItem = ({ data: { item: like, unit }, t }) => {
  const dispatch         = useDispatch();
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  const likeDislike = () => {
    if (like)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [like.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [unit.id] }));
  };

  return (
    <Card raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Button floated="right" size="tiny" icon="remove" onClick={likeDislike} color="red" />
        <Header size="medium" className="no-margin-top">
          <Link to={link}>
            {unit.name}
          </Link>
        </Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${t('constants.content-types.' + unit.content_type)}`} />
      </Card.Content>
    </Card>
  );
};
