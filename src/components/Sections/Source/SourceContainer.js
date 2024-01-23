import React, { useContext } from 'react';
import TOC from './TOC/TOC';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import SourceToolbarWeb from './SourceToolbarWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import SourceToolbarMobile from './SourceToolbarMobile';
import BreadcrumbTextPage from '../../Pages/WithText/BreadcrumbTextPage';
import PrevNextBtns from './PrevNextBtns';
import { useSelector } from 'react-redux';
import { sourcesGetSourceByIdSelector } from '../../../redux/selectors';
import { useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from '../../../helpers/utils';

const SourceContainer = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const navigate           = useNavigate();

  const source = useSelector(sourcesGetSourceByIdSelector)(id);

  if (!isEmpty(source?.children)) {
    navigate(`../sources/${source.children[0]}`);
  }

  const toc        = <TOC />;
  const toolbar    = isMobileDevice ? <SourceToolbarMobile /> : <SourceToolbarWeb />;
  const breadcrumb = <BreadcrumbTextPage />;
  const prevNext   = <PrevNextBtns />;

  return isMobileDevice ? (
    <TextLayoutMobile
      toc={toc}
      toolbar={toolbar}
      prevNext={prevNext}
      breadcrumb={breadcrumb}
    />
  ) : (
    <TextLayoutWeb
      toc={toc}
      toolbar={toolbar}
      prevNext={prevNext}
      breadcrumb={breadcrumb}
    />
  );
};

export default SourceContainer;
