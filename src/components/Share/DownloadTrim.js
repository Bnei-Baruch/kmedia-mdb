import React, { useEffect, useState } from 'react';
import { faXmark, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Splash } from '../shared/Splash/Splash';
import DownloadTrimItem from './DownloadTrimItem';
import { clsx } from 'clsx';
import Icon from '../Icon';
import { trimGetListSelector, trimGetWipsSelector } from '../../redux/selectors';

const DownloadTrim = () => {
  const { t } = useTranslation();
  const [open, setOpen]   = useState(true);
  const [isMin, setIsMin] = useState(false);

  const list = useSelector(trimGetListSelector);
  const wips = useSelector(trimGetWipsSelector);

  useEffect(() => {
    setOpen(true);
    setIsMin(false);
  }, [list.length]);
  if ((list.length === 0 && wips.length === 0) || !open)
    return null;

  const renderWip = (x, i) => {
    i = list.length + i + 1;
    return (
      <div className="flex" key={`wip_${i}`}>
        <div className="flex-[9] flex items-center">
          {`${i}. ${t('messages.trimmed-content-wip')} `}
          <Splash isLoading icon="circle notch" color="blue" width="20" text=""/>
        </div>
        <div className="flex-[7]">
        </div>
      </div>
    );
  };

  return (
    <div className={clsx('trimmed_files', { 'minimized': isMin })}>
      <div className="top clearfix border rounded p-4">
        <button
          className="float-right p-1 text-gray-400 hover:text-gray-200"
          onClick={() => setOpen(false)}
        >
          <Icon icon={faXmark} />
        </button>
        <button
          className="float-right p-1 text-gray-400 hover:text-gray-200"
          onClick={() => setIsMin(!isMin)}
        >
          <Icon icon={isMin ? faChevronUp : faChevronDown} />
        </button>
        <h3 className="float-left text-white">
          {wips.length > 0 ? t('messages.trimmed-title-wip') : t('messages.trimmed-title')}
        </h3>
      </div>
      {
        !isMin && (
          <>
            <div className=" px-4  content">
              <div>
                {
                  list.map((item, i) => <DownloadTrimItem key={i} pos={i + 1} item={item}/>)
                }
                {
                  wips.map(renderWip)
                }
              </div>
            </div>
            <div className=" px-4 ">{t('messages.trim-expiration')}</div>
            <hr className="invisible my-4" />
          </>
        )
      }
    </div>
  );
};

export default DownloadTrim;
