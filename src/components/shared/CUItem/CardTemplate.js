import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Header, Label, Popup, Divider, Progress } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import { formatDuration } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';
import { toHumanReadableTime } from '../../../helpers/time';

const CardTemplate = ({ unit, language, withCCUInfo, link, ccu, description, children, playTime }) => {
  const dir = isLanguageRtl(language) ? 'rtl' : 'ltr';

  const coInfo = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <Divider style={{ width: '4em' }} />
      <div style={{ margin: '0 -1.5em' }}>
        <UnitLogo collectionId={ccu.id} />
      </div>
      <Popup
        basic
        content={ccu.name}
        trigger={<Header size="small" content={ccu.name || NO_NAME} textAlign="left" />}
      />
    </div>
  ) : null;
  let percent  = null;
  if (playTime) {
    const sep = link.indexOf('?') > 0 ? `&` : '?';
    link      = `${link}${sep}sstart=${toHumanReadableTime(playTime)}`;
    percent   = (
      <Progress
        size="tiny"
        className="margin-top-8"
        color="green"
        percent={playTime * 100 / unit.duration}
      />
    );
  }

  return (
    <Card raised className="cu_item" link href={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id} width={520} />
        <Container className="cu_item_img_info" textAlign="right">
          <Label className="cu_item_duration" content={formatDuration(unit.duration)} />
          {coInfo}
        </Container>
      </div>
      <Card.Content>
        <Card.Description content={unit.name} />
      </Card.Content>
      <Card.Meta className={`cu_info_description ${dir}`}>
        {description.map((d, i) => (<span key={i}>{d}</span>))}
        {percent}
      </Card.Meta>
      {children ? <Card.Content extra>{children}</Card.Content> : null}
    </Card>
  );
};

CardTemplate.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  language: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  children: PropTypes.array
};

export default CardTemplate;
