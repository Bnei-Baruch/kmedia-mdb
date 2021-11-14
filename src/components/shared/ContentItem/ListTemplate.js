import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Progress } from 'semantic-ui-react';
import clsx from 'clsx';

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
  'big': 287,
};

const ListTemplate = ({
                        unit,
                        source,
                        language,
                        withCUInfo,
                        withCCUInfo,
                        link,
                        ccu,
                        description,
                        children,
                        playTime,
                        size = 'big',
                        selected,
                        label,
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
  if (unit && playTime) {
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

  const width = isMobileDevice ? 165 : imageWidthBySize[size];
  return (
    <Container
      as={Link}
      to={link}
      key={(unit && unit.id) || (source && source.id)}
      className={clsx('cu_item cu_item_list no-thumbnail', { [size]: !!size, selected })}
    >
      <div>
        {withCUInfo && unit && <div className="cu_item_duration">{formatDuration(unit.duration)}</div>}
        {label ? <div className="cu_item_label">{label}</div> : null}
        {percent}
        <div className="cu_item_img" style={{ width }}>
          <UnitLogo unitId={unit && unit.id} sourceId={source && source.id} width={width} />
        </div>
      </div>
      <div className={`cu_item_info ${dir}`} style={{ left: !children ? 0 : '1em' }}>
        {ccu_info}
        {withCUInfo && <div className={clsx('cu_item_name', { 'font_black': !ccu_info })}>
          {(unit && unit.name) || (source && source.name)}
        </div>}
        <div className={`cu_info_description ${dir} text_ellipsis`}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
      {
        children ? (
          <div className="cu_item_actions">
            {children}
          </div>
        ) : null
      }
    </Container>
  );
};

ListTemplate.propTypes = {
  unit: shapes.ContentUnit,
  source: shapes.Source,
  language: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  position: PropTypes.number
};

export default ListTemplate;
