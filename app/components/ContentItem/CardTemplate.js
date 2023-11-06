import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Header, Popup, Divider, CardMeta, CardDescription, CardContent } from '/lib/SUI';
import { useSelector } from 'react-redux';

import * as shapes from '../../../src/components/shapes';
import { NO_NAME } from '../../../src/helpers/consts';
import { formatDuration } from '../../../src/helpers/utils';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';

import UnitLogo from '../../../src/components/shared/Logo/UnitLogo';
import { UnitProgress } from './UnitProgress';
import Link from 'next/link';

const CardTemplate = ({ unit, withCCUInfo, link, ccu, description, children, playTime }) => {
  const dir = 'ltr';//useSelector(state => settings.getUIDir(state.settings));

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

  const trimText = (title, len = 150) => title.length < len ? title : `${title.substr(0, title.lastIndexOf(' ', len))}...`;

  return (
    <Card raised className="cu_item" as={Link} href={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id} width={700} />
        <Container className="cu_item_img_info" textAlign="right">
          {unit.duration && <div className="cu_item_duration">{formatDuration(unit.duration)}</div>}
          {coInfo}
          <UnitProgress unit={unit} playTime={playTime} />
        </Container>
      </div>
      <CardContent>
        <CardDescription content={trimText(unit.name)} />
      </CardContent>
      <CardMeta className={`cu_info_description ${dir}`}>
        {description.map((d, i) => (<span key={i}>{d}</span>))}
      </CardMeta>
      {children ? <CardContent extra textAlign="right">{children}</CardContent> : null}
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
