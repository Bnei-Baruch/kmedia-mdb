import React, { useContext } from 'react';
import TOC from './TOC/TOC';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import SourceToolbarWeb from './SourceToolbarWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import SourceToolbarMobile from './SourceToolbarMobile';
import BreadcrumbTextPage from '../../Pages/WithText/BreadcrumbTextPage';
import PrevNextBtns from './PrevNextBtns';

const SourceContainer = () => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const toc                = <TOC />;
  const toolbar            = isMobileDevice ? <SourceToolbarMobile /> : <SourceToolbarWeb />;
  const breadcrumb         = <BreadcrumbTextPage />;
  const prevNext           = <PrevNextBtns />;


  return isMobileDevice ? (
    <TextLayoutMobile
      toc={toc}
      toolbar={toolbar}
      prevNext={prevNext}
    />
  ) : (
    <TextLayoutWeb
      breadcrumb={breadcrumb}
      toc={toc}
      toolbar={toolbar}
      prevNext={prevNext}
    />
  );
};

export default SourceContainer;
