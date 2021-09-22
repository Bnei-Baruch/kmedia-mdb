import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Header, Progress, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { NO_NAME } from '../../../helpers/consts';
import { toHumanReadableTime } from '../../../helpers/time';
import { formatDuration } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';

const imageWidthBySize = {
  'small': 144,
  '': 287
};

const ListTemplate = ({
                        unit,
                        language,
                        withCCUInfo,
                        link,
                        ccu,
                        description,
                        children,
                        playTime,
                        size = '',
                        selected
                      }) => {
  const dir                = isLanguageRtl(language) ? 'rtl' : 'ltr';
  const { isMobileDevice } = useContext(DeviceInfoContext);

  let ccu_info;
  if (!isMobileDevice && size !== 'small') {
    ccu_info = ccu && withCCUInfo ? (
      <div className="cu_item_info_co">
        <span style={{ display: 'inline-block' }}>
          <UnitLogo collectionId={ccu.id} />
        </span>
        <Header size="small" content={ccu.name || NO_NAME} textAlign="left" />
      </div>
    ) : null;
  } else {
    ccu_info = ccu && withCCUInfo ? (
      <div className="cu_item_info_co ">
        <h5 className="no-padding no-margin text_ellipsis">{ccu.name || NO_NAME}</h5>
      </div>) : null;
  }

  let percent = null;
  if (playTime) {
    const sep = link.indexOf('?') > 0 ? `&` : '?';
    link      = `${link}${sep}sstart=${toHumanReadableTime(playTime)}`;
    percent   = (
      <Progress
        size="tiny"
        className="cu_item_progress"
        percent={playTime * 100 / unit.duration}
      />
    );
  }

  return (
    <Table.Row
      as={Link}
      to={link}
      key={unit.id}
      className={`cu_item cu_item_list no-thumbnail${size ? ' ' + size : ''}${selected ? ' selected' : ''}`}
      verticalAlign="top"
    >
      <Table.Cell width={2} className={'padding_r_l_0 no-padding-top'} verticalAlign={'top'}>
        <div style={{ position: 'relative' }}>
          <div className="cu_item_duration">{formatDuration(unit.duration)}</div>
          {percent}
          <span className="cu_item_img">
            <UnitLogo unitId={unit.id} width={isMobileDevice ? 165 : imageWidthBySize[size]} />
          </span>
        </div>
      </Table.Cell>
      <Table.Cell verticalAlign={'top'} className={`cu_item_info ${dir}`}>
        {ccu_info}
        <span className={`cu_item_name ${!ccu_info ? ' font_black' : ''}`}>
          {unit.name}
        </span>
        <div className={`cu_info_description ${dir}`}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </Table.Cell>
      {
        children ? (
          <Table.Cell width="1" verticalAlign="middle" textAlign="center" className="padding_r_l_0">
            {children}
          </Table.Cell>
        ) : null
      }
    </Table.Row>
  );
};

ListTemplate.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  language: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  position: PropTypes.number
};

export default ListTemplate;
