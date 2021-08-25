import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Header, Label, Popup, Divider } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import { formatDuration } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';

const CardTemplate = ({ unit, language, withCCUInfo, link, ccu, description, children }) => {
  const dir = isLanguageRtl(language) ? 'rtl' : 'ltr';

  const coInfo = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <Divider style={{ width: '4em' }} />
      <div style={{ margin: '0 -1.5em' }}>
        <UnitLogo collectionId={ccu.id} circular  fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?width=120&nocrop=false&stripmeta=true&url=http%3A%2F%2Flocalhost%2Fassets%2Flessons%2Flatest_lesson_28.jpg'}/>
      </div>
      <Popup
        basic
        content={ccu.name}
        trigger={<Header size="small" content={ccu.name || NO_NAME} textAlign="left" />}
      />
    </div>
  ) : null;

  return (
    <Card raised className="cu_item" link href={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id}  fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?width=520&nocrop=false&stripmeta=true&url=http%3A%2F%2Flocalhost%2Fassets%2Flessons%2Flatest_lesson_28.jpg'} />
        <Container className="cu_item_img_info" textAlign="right">
          <Label className="cu_item_duration" content={formatDuration(unit.duration)} />
          {coInfo}
        </Container>
      </div>
      <Card.Content>
        <Card.Description content={unit.name} />
      </Card.Content>
      <Card.Meta
        className={`cu_info_description ${dir}`}
        content={description.map((d, i) => (<span key={i}>{d}</span>))}
      />
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
