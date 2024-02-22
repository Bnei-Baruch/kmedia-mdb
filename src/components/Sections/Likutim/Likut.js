import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';
import Helmets from '../../shared/Helmets';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import { usePrepareLikutAudio } from './usePrepareLikutAudio';
import LikutToolbarMobile from './LikutToolbarMobile';
import LikutToolbarWeb from './LikutToolbarWeb';

const LikutContainer = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { id } = useParams();
  const { t }  = useTranslation();

  const cu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));

  usePrepareLikutAudio();

  return (
    <>
      <Helmets.Basic title={`${t('likutim.item-header')} ${cu?.name}`} />
      {
        isMobileDevice
          ? <TextLayoutMobile toolbar={<LikutToolbarMobile />} />
          : <TextLayoutWeb toolbar={<LikutToolbarWeb />} />
      }
    </>
  );
};

export default LikutContainer;
