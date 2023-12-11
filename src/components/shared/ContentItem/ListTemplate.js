import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Container, Header, Popup, Ref } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { NO_NAME } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';

import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';
import { imageWidthBySize } from './helper';
import UnitLogoWithDuration from '../UnitLogoWithDuration';
import UnitLogo from '../Logo/UnitLogo';
import { UnitProgress } from './UnitProgress';

const ListTemplate = (
  {
    unit,
    source,
    tag,
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
    name,
    showImg
  }
) => {
  const itemRef = useRef(null);

  const handleItemRef = r => itemRef.current = r;

  const dir                = useSelector(state => settings.getUIDir(state.settings));
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [isNeedTooltip, setIsNeedTooltip] = useState(null);
  const cuInfoRef                         = useRef();

  useEffect(() => {
    if (cuInfoRef.current && (cuInfoRef.current.scrollHeight > cuInfoRef.current.clientHeight)) {
      setIsNeedTooltip(true);
    }
  }, [cuInfoRef]);

  useEffect(() => {
    if (selected && itemRef.current) {
      const { scrollX, scrollY } = window;
      itemRef.current.scrollIntoView(true);
      window.scrollTo(scrollX, scrollY);
    }
  }, [selected]);

  const info = ((ccu || source || tag) && withCCUInfo)
    ? (
      <div className="cu_item_info_co ">
        <span className="no-padding no-margin text_ellipsis">
          {ccu?.name || source?.name || tag?.label || NO_NAME}
        </span>
      </div>
    ) : null;

  const renderCUInfo = () => {
    const _name   = name || unit?.name || source?.name || tag?.label;
    const content = (
      <Ref innerRef={cuInfoRef}>
        <Header
          as={size === 'big' || isMobileDevice ? 'h5' : 'h3'}
          className="cu_item_name"
          content={_name} />
      </Ref>
    );

    if (!isNeedTooltip)
      return content;

    return <Popup
      content={_name}
      dir={dir}
      trigger={content}
      position="top center"
    />;
  };

  const width = isMobileDevice ? 165 : imageWidthBySize[size];

  return (
    <Ref innerRef={handleItemRef}>
      <Container
        id={unit?.id}
        as={Link}
        to={link}
        key={(unit && unit.id) || (source && source.id) || (tag && tag.id)}
        className={clsx('cu_item cu_item_list no-thumbnail', { [size]: !!size, selected })}
      >
        <div>
          {label ? <div className="cu_item_label">{label}</div> : null}
          <UnitProgress unit={unit} playTime={playTime} />
          <div className="cu_item_img" style={{ width }}>
            {withCUInfo ? <UnitLogoWithDuration unit={unit} sourceId={source?.id} width={width} showImg={showImg} /> :
              <UnitLogo unitId={unit?.id} sourceId={source?.id} width={width} showImg={showImg} />}
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
    </Ref>
  );
};

ListTemplate.propTypes = {
  unit: shapes.ContentUnit,
  source: shapes.Source,
  tag: shapes.Topic,
  link: PropTypes.any.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  position: PropTypes.number
};

export default ListTemplate;
