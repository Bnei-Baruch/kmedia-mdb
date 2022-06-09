import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { PAGE_NS_PROGRAMS } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterLabels from '../../FiltersAside/FilterLabels';
import PageHeader from '../../Pages/Collection/Header';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import WipErr from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import ItemOfList from './ItemOfList';

const ProgramPage = ({ t }) => {
  const [pageNo, setPageNo] = useState(1);

  const { id: cid } = useParams();
  const namespace   = `${PAGE_NS_PROGRAMS}_${cid}`;

  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, cid));

  const { items, total, wip, err } = useSelector(state => lists.getNamespaceState(state.lists, namespace)) || {};
  const language                   = useSelector(state => settings.getLanguage(state.settings));
  const pageSize                   = useSelector(state => settings.getPageSize(state.settings));
  const selected                   = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);
  const prevSel                    = usePrevious(selected);

  const dispatch = useDispatch();
  useEffect(() => {
    let page_no = pageNo > 1 ? pageNo : 1;
    if (page_no !== 1 && prevSel !== selected) page_no = 1;

    dispatch(actions.fetchList(namespace, page_no, { collection: cid, pageSize, withViews: true }));
  }, [language, pageNo, selected]);

  const onPageChange = n => setPageNo(n);

  const wipErr = WipErr({ wip, err, t });

  return (<>
    <PageHeader collection={collection} namespace={namespace} title="programs-collection" />
    <Container className="padded" fluid>
      <Divider />
      <Grid divided>
        <Grid.Column width="4" className="filters-aside-wrapper">
          <Filters
            namespace={namespace}
            baseParams={{ collection: [cid] }}
          />
        </Grid.Column>
        <Grid.Column width="12">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
          <FilterLabels namespace={namespace} />
          {
            wipErr || items?.map((id, i) => <ItemOfList id={id} ccu={collection} key={i} />)
          }
          <Divider fitted />
          <Container className="padded pagination-wrapper" textAlign="center">
            {total > 0 && <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
              language={language}
              onChange={onPageChange}
            />}
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  </>);
};

export default withNamespaces()(ProgramPage);
