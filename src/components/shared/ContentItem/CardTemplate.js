import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { NO_NAME } from '../../../helpers/consts';
import { formatDuration } from '../../../helpers/utils';
import * as shapes from '../../shapes';

import { settingsGetUIDirSelector } from '../../../redux/selectors';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../Logo/UnitLogo';
import { UnitProgress } from './UnitProgress';

const CardTemplate = ({ unit, withCCUInfo, link, ccu, description, children, playTime }) => {
  const dir = useSelector(settingsGetUIDirSelector);

  const coInfo = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <UnitLogo collectionId={ccu.id} circular height={80} width={80} />
      <Popover className="cu_item_popover">
        <PopoverButton as="div">
          <h4>{ccu.name || NO_NAME}</h4>
        </PopoverButton>
        <PopoverPanel className="cu_item_popover_panel">
          {ccu.name}
        </PopoverPanel>
      </Popover>
    </div>
  ) : null;

  const trimText = (title, len = 150) => {
    if (!title) {
      return '';
    }

    return title.length < len ? title : `${title.substr(0, title.lastIndexOf(' ', len))}...`;
  };

  return (
    <Link to={link} className="cu_item cu_item_card">
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id} width={700} />
        <div className="cu_item_img_info">
          {unit.duration && <div className="cu_item_duration">{formatDuration(unit.duration)}</div>}
          {coInfo}
          <UnitProgress unit={unit} playTime={playTime} />
        </div>
      </div>
      <div className="cu_item_body">
        <div>{trimText(unit.name)}</div>
      </div>
      <div className={`cu_info_description ${dir}`}>
        {description.map((d, i) => (<span key={i}>{d}</span>))}
      </div>
      {children ? <div className="cu_item_footer">{children}</div> : null}
    </Link>
  );
};

CardTemplate.propTypes = {
  unit       : shapes.ContentUnit.isRequired,
  link       : PropTypes.object.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu        : shapes.Collection,
  description: PropTypes.array,
  children   : PropTypes.any
};

export default CardTemplate;
