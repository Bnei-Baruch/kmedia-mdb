import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Helmets from '../../shared/Helmets';
import { sourcesGetSourceByIdSelector, sourcesGetPathByIDSelector } from '../../../redux/selectors';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import SourceToolbarWeb from './SourceToolbarWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import SourceToolbarMobile from './SourceToolbarMobile';
import BreadcrumbTextPage from '../../Pages/WithText/BreadcrumbTextPage';
import PrevNextBtns from './PrevNextBtns';
import TOC from './TOC/TOC';
import { getFullPath } from './helper';

const SourceContainer = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const navigate           = useNavigate();

  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const getPathById   = useSelector(sourcesGetPathByIDSelector);
  const source        = getSourceById(id) || false;
  const path          = getFullPath(id, getPathById);
  const parent        = path[1];
  const root          = getSourceById(parent.parent_id);

  const childId = source.children?.[0];

  //TODO: David use https://reactrouter.com/en/main/route/loader
  useEffect(() => {
    childId && navigate(`../sources/${childId}`, { replace: true });
  }, [childId, navigate]);

  const toc        = <TOC />;
  const breadcrumb = <BreadcrumbTextPage />;
  const prevNext   = <PrevNextBtns />;

  return <>
    <Helmets.Basic
      title={`${source.name} - ${parent?.name} - ${root?.name}`}
      description={parent?.description}
    />
    {
      isMobileDevice ? (
        <TextLayoutMobile
          id={childId}
          toc={toc}
          toolbar={<SourceToolbarMobile />}
          prevNext={prevNext}
          breadcrumb={breadcrumb}
        />
      ) : (
        <TextLayoutWeb
          id={childId}
          toc={toc}
          toolbar={<SourceToolbarWeb />}
          prevNext={prevNext}
          breadcrumb={breadcrumb}
        />
      )
    }
  </>;
};

export default SourceContainer;
