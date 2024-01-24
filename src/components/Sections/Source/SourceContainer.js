import React, { useContext, useEffect } from 'react';
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

const SourceContainer = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const navigate           = useNavigate();

  const source = useSelector(sourcesGetSourceByIdSelector)(id);

  const childId = source.children?.[0];
  
  //TODO: David use https://reactrouter.com/en/main/route/loader
  useEffect(() => {
    childId && navigate(`../sources/${childId}`, { replace: true });
  }, [childId]);

  const toc        = <TOC />;
  const breadcrumb = <BreadcrumbTextPage />;
  const prevNext   = <PrevNextBtns />;

  return isMobileDevice ? (
    <TextLayoutMobile
      id={childId || id}
      toc={toc}
      toolbar={<SourceToolbarMobile />}
      prevNext={prevNext}
      breadcrumb={breadcrumb}
    />
  ) : (
    <TextLayoutWeb
      id={childId || id}
      toc={toc}
      toolbar={<SourceToolbarWeb />}
      prevNext={prevNext}
      breadcrumb={breadcrumb}
    />
  );
};

export default SourceContainer;
