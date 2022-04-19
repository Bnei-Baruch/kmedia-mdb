import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Progress, Ref } from 'semantic-ui-react';
import clsx from 'clsx';

import * as shapes from '../../shapes';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { NO_NAME } from '../../../helpers/consts';
import { formatDuration, stopBubbling } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';
import { PLAYER_POSITION_STORAGE_KEY } from '../../AVPlayer/constants';
import { withNamespaces } from 'react-i18next';

const imageWidthBySize = {
  'small': 144,
  'big': 287,
};

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
  label,
  t
}) => {
  const dir                = isLanguageRtl(language) ? 'rtl' : 'ltr';
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [cuInfoShowAll, setCuInfoShowAll] = useState(null);
  const cuInfoRef                         = useRef();

  useEffect(() => {
    if (cuInfoRef.current.scrollHeight > cuInfoRef.current.clientHeight) {
      setCuInfoShowAll(false);
    }
  }, [cuInfoRef.current]);

  const toggleShowCUInfo = e => {
    setCuInfoShowAll(!cuInfoShowAll);
    stopBubbling(e);
  };

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
          <UnitLogo unitId={unit && unit.id} sourceId={source && source.id} width={width} />
        </div>
      </div>
      <div className={clsx('cu_item_info', { [dir]: true, 'with_actions': !!children })}>
        {
          withCUInfo && (
            <>
              <Ref innerRef={cuInfoRef}>
                <Header
                  as={size === 'big' ? 'h5' : 'h3'}
                  className={clsx('cu_item_name', { 'show_part': !cuInfoShowAll })}
                >
                  {(unit && unit.name) || (source && source.name) || (tag && tag.label)}
                </Header>
              </Ref>
              {
                (cuInfoShowAll !== null) && (
                  <Button
                    floated="right"
                    basic
                    color="blue"
                    className="clear_button"
                    onClick={toggleShowCUInfo}
                    content={t(`topics.show-${cuInfoShowAll ? 'less' : 'more'}`)}
                  />
                )
              }
            </>
          )
        }
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

export default withNamespaces()(ListTemplate);
