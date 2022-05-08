import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Popup, Progress, Ref } from 'semantic-ui-react';
import clsx from 'clsx';

import * as shapes from '../../shapes';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { NO_NAME } from '../../../helpers/consts';
import { formatDuration } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';
import { PLAYER_POSITION_STORAGE_KEY } from '../../AVPlayer/constants';
import { imageWidthBySize } from './helper';

const ListTemplate = ({
  unit,
  source,
  tag,
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
  label
}) => {

  const dir                = isLanguageRtl(language) ? 'rtl' : 'ltr';
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [isNeedTooltip, setIsNeedTooltip] = useState(null);
  const cuInfoRef                         = useRef();

  useEffect(() => {
    if (cuInfoRef.current.scrollHeight > cuInfoRef.current.clientHeight) {
      setIsNeedTooltip(true);
    }
  }, [cuInfoRef.current]);

  const info = ((ccu || source || tag) && withCCUInfo) ? (
    <div className="cu_item_info_co ">
      <span className="no-padding no-margin text_ellipsis">
        {(ccu && ccu.name) || (source && source.name) || (tag && tag.label) || NO_NAME}
      </span>
    </div>
  ) : null;

  let percent = null;
  if (unit && playTime) {
    localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${unit.id}`, playTime);
    percent = (
      <Progress
        size="tiny"
        className="cu_item_progress"
        percent={playTime * 100 / unit.duration}
      />
    );
  }

  const renderCUInfo = () => {
    const name    = unit?.name || source?.name || tag?.label;
    const content = (
      <Ref innerRef={cuInfoRef}>
        <Header
          as={size === 'big' || isMobileDevice ? 'h5' : 'h3'}
          className="cu_item_name"
          content={name} />
      </Ref>
    );

    if (!isNeedTooltip)
      return content;

    return <Popup
      content={name}
      dir={dir}
      trigger={content}
      position="top center"
    />;
  };

  const width = isMobileDevice ? 165 : imageWidthBySize[size];
  return (
    <Container
      as={Link}
      to={link}
      key={(unit && unit.id) || (source && source.id) || (tag && tag.id)}
      className={clsx('cu_item cu_item_list no-thumbnail', { [size]: !!size, selected })}
    >
      <div>
        {withCUInfo && unit?.duration && <div className="cu_item_duration">{formatDuration(unit.duration)}</div>}
        {label ? <div className="cu_item_label">{label}</div> : null}
        {percent}
        <div className="cu_item_img" style={{ width }}>
          <UnitLogo unitId={unit?.id} sourceId={source?.id} width={width} />
        </div>
      </div>
      <div className={clsx('cu_item_info', { [dir]: true, 'with_actions': !!children })}>
        {withCUInfo && renderCUInfo()}
        {info}
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
  tag: shapes.Topic,
  language: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  position: PropTypes.number
};

export default ListTemplate;
