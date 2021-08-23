import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { MY_NAMESPACE_HISTORY } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/my';
import CUItem from '../../shared/CUItem';

export const HistoryItem = ({ data: { item: history }, t }) => {

  return (
    <CUItem id={history.content_unit_uid} />
  );
};
