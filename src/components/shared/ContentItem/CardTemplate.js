import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Header, Popup, Divider } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import * as shapes from '../../shapes';
import { NO_NAME } from '../../../helpers/consts';
import { formatDuration } from '../../../helpers/utils';
import { selectors as settings } from '../../../redux/modules/settings';

import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';
import { UnitProgress } from './UnitProgress';

const CardTemplate = ({ unit, withCCUInfo, link, ccu, description, children, playTime }) => {
  const dir = useSelector(state => settings.getUIDir(state.settings));

  const coInfo = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <Divider style={{ width: '1em' }} />
      <UnitLogo collectionId={ccu.id} circular height={80} width={80} />
      <Popup
        basic
        content={ccu.name}
        trigger={<Header size="medium" content={ccu.name || NO_NAME} textAlign="left" />}
      />
    </div>
  ) : null;

  const trimText = (title, len = 150) => {
    if (!title) {
      return '';
    }

    return title.length < len ? title : `${title.substr(0, title.lastIndexOf(' ', len))}...`;
  }

  return (
    <Card raised className="cu_item" as={Link} to={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id} width={700} />
        <Container className="cu_item_img_info" textAlign="right">
          {unit.duration && <div className="cu_item_duration">{formatDuration(unit.duration)}</div>}
          {coInfo}
          <UnitProgress unit={unit} playTime={playTime} />
        </Container>
      </div>
      <Card.Content>
        <Card.Description content={trimText(unit.name)} />
      </Card.Content>
      <Card.Meta className={`cu_info_description ${dir}`}>
        {description.map((d, i) => (<span key={i}>{d}</span>))}
      </Card.Meta>
      {children ? <Card.Content extra textAlign="right">{children}</Card.Content> : null}
    </Card>
  );
};

CardTemplate.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  link: PropTypes.object.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  children: PropTypes.any
};

export default CardTemplate;
