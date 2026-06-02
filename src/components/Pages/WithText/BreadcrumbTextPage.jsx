import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import {
  textPageGetSubjectSelector,
  sourcesGetPathByIDSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';

const BreadcrumbTextPage = () => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const subject            = useSelector(textPageGetSubjectSelector);
  const fullPath           = useSelector(sourcesGetPathByIDSelector)(subject.id);
  const uiLang             = useSelector(settingsGetUILangSelector);

  const current = fullPath.pop();

  const divider = (
    <span className="material-symbols-outlined divider">
      {isLanguageRtl(uiLang) ? 'chevron_left' : 'chevron_right'}
    </span>
  );

  return (
    <div className="text_toolbar__breadcrumb no_print">
      <Link to={'sources/'}>
        {t('nav.sidebar.sources')}
      </Link>
      {divider}
      <div>
        {isMobileDevice ? '...' : fullPath.map(x => x.name).join('/')}
      </div>
      {divider}
      <div>
        {current?.name}
      </div>
    </div>
  );
};

export default BreadcrumbTextPage;
