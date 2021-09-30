import React from 'react';

import { CT_CLIP } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';
import { withNamespaces } from 'react-i18next';

const ClipsList = ({ t }) => {

  const renderActions = unit => {
    if (!unit) return null;

    const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);
    const co        = breakdown.getClips()[0];
    if (!co) return null;
    return (
      <Link to={canonicalLink(co)}>{t('programs.list.show_all')}</Link>
    );
  };

  return (
    <UnitList
      key="programs-clips"
      namespace="programs-clips"
      renderActions={renderActions}
      extraFetchParams={{ content_type: CT_CLIP }}
    />
  );
};
export default withNamespaces()(ClipsList);
