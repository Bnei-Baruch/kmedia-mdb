import { isEqual } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Divider, Grid, Modal } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { PAGE_NS_PROGRAMS, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';

import { actions, selectors as lists } from '../../../redux/modules/lists';
import { actions as prepareActions } from '../../../redux/modules/preparePage';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import Filters from './Filters';
import ItemOfList from './ItemOfList';

const MainPage = ({ t }) => {
  const [openFilters, setOpenFilters] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { items, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_PROGRAMS)) || {};
  const language         = useSelector(state => settings.getLanguage(state.settings));
  const pageSize         = useSelector(state => settings.getPageSize(state.settings));
  const selected         = useSelector(state => filters.getFilters(state.filters, PAGE_NS_PROGRAMS), isEqual);
  const dir              = getLanguageDirection(language);

  const prevSel = usePrevious(selected);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_PROGRAMS, pageNo)), [dispatch]);

  useEffect(() => {
    dispatch(prepareActions.fetchCollections());
  }, [language, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(PAGE_NS_PROGRAMS, pageNo, {
        content_type: UNIT_PROGRAMS_TYPE,
        pageSize,
        withViews: true
      }));
    }

  }, [language, dispatch, pageNo, selected]);


  const toggleFilters = () => setOpenFilters(!openFilters);

  const renderMobileFilters = () => (
    <Modal
      closeIcon
      open={openFilters}
      onClose={toggleFilters}
      dir={dir}
      className={dir}
    >
      <Modal.Content className="filters-aside-wrapper" scrolling>
        <Filters
          namespace={PAGE_NS_PROGRAMS}
          baseParams={{ content_type: UNIT_PROGRAMS_TYPE }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button primary content={t('buttons.close')} onClick={toggleFilters} />
      </Modal.Actions>
    </Modal>
  );

  return (<>
      <SectionHeader section="programs" />
      <Container className="padded" fluid>{
        isMobileDevice && <Button className="" basic icon="filter" floated={'right'} onClick={toggleFilters} />
      }
      <Divider />
      <Grid divided>
        {
          !isMobileDevice ? (
            <Grid.Column width="4" className="filters-aside-wrapper">
              <Filters
                namespace={PAGE_NS_PROGRAMS}
                baseParams={{ content_type: UNIT_PROGRAMS_TYPE }}
              />
            </Grid.Column>
          ) : renderMobileFilters()
        }
        <Grid.Column width={isMobileDevice ? 16 : 12}>
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
          <FilterLabels namespace={PAGE_NS_PROGRAMS} />
          {items?.map((id, i) => <ItemOfList id={id} key={i} />)}
          <Divider fitted />
          <Container className="padded pagination-wrapper" textAlign="center">
            {total > 0 && <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
              language={language}
              onChange={setPage}
            />}
          </Container>
        </Grid.Column>
      </Grid>
      </Container>
    </>
  );
};

export default withNamespaces()(MainPage);
