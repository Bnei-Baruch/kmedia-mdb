import React from 'react';
import { Table } from 'semantic-ui-react';

import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';
import { withNamespaces } from 'react-i18next';

const ProgramsList = ({ t }) => {

  const renderActions = unit => {
    if (!unit) return null;

    const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);
    const program   = breakdown.getPrograms()[0];
    if (!program) return null;
    return (
      <Link to={canonicalLink(program)}>{t('programs.list.show_all')}</Link>
    );
  };

  return (
    <UnitList
      key="programs-main"
      namespace="programs-main"
      renderActions={renderActions}
      extraFetchParams={{ content_type: CT_VIDEO_PROGRAM_CHAPTER }}
    />
  );
};
export default withNamespaces()(ProgramsList);
