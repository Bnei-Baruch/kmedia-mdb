import { Table } from 'semantic-ui-react';
import * as renderUnitHelper from '../../../../helpers/renderUnitHelper';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../../../../lib/redux/slices/mdbSlice';
import { useTranslation } from 'next-i18next';

const ArticleFeed = ({ id }) => {
  const { t } = useTranslation();
  const unit  = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));

  return (
    <Table.Row verticalAlign="top">
      <Table.Cell collapsing singleLine>
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
      </Table.Cell>
      <Table.Cell>
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderUnitDescription(unit)}
      </Table.Cell>
    </Table.Row>
  );
};

export default ArticleFeed;
