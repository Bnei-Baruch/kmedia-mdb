import React, { useContext } from 'react';
import { Container, Breadcrumb, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import { selectors as sources } from '../../../redux/modules/sources';
import { useTranslation } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { selectors as settings } from '../../../redux/modules/settings';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const BreadcrumbTextPage = () => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const subject            = useSelector(state => textPage.getSubject(state.textPage));
  const fullPath           = useSelector(state => sources.getPathByID(state.sources)(subject.id));
  const current            = fullPath.pop();

  const uiLang  = useSelector(state => settings.getUILang(state.settings));
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
