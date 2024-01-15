import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation, useTranslation } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import { actions } from '../../../redux/modules/music';
import List from './List';
import { musicGetDataSelector, musicGetErrorSelector, musicGetWipSelector } from '../../../redux/selectors';

const Music = () => {
  const wip                         = useSelector(musicGetWipSelector);
  const err                         = useSelector(musicGetErrorSelector);
  const items                       = useSelector(musicGetDataSelector);
  const [dataLoaded, setDataLoaded] = useState(false);

  const dispatch = useDispatch();
  const { t }    = useTranslation();

  useEffect(() => {
    if (!wip && !err && !dataLoaded) {
      dispatch(actions.fetchMusic());
      setDataLoaded(true);
    }

  }, [dispatch, wip, err, dataLoaded]);

  const content = WipErr({ wip, err, t }) || (
    <Container className="padded">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length || 0}/>
      <Divider fitted/>
      <List items={items}/>
    </Container>
  );

  return (
    <>
      <SectionHeader section="music"/>
      <Divider fitted/>
      {content}
    </>
  );
};

export default withTranslation()(Music);
