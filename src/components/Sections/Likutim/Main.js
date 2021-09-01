import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { List, Card, Grid, Divider, Container } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/likutim';
import { selectors as settings } from '../../../redux/modules/settings';
import { canonicalLink } from '../../../helpers/links';
import { noop } from '../../../helpers/utils';

import Link from '../../Language/MultiLanguageLink';
import SectionHeader from '../../shared/SectionHeader';
import Filters from '../../Filters/Filters';
import filterComponents from '../../../components/Filters/components';

const filters = [
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter,
  },
  {
    name: 'date-filter',
    component: filterComponents.DateFilter,
  },
  {
    name: 'language-filter',
    component: filterComponents.LanguageFilter,
  },
];

const Main = ({ t }) => {
  const wip = useSelector(state => selectors.getWip(state.likutim));
  const err = useSelector(state => selectors.getError(state.likutim));
  const likutim = useSelector(state => selectors.getLikutim(state.likutim), shallowEqual);
  const language = useSelector(state => settings.getContentLanguage(state.settings));

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
  }, [language])

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !dataLoaded) {
      dispatch(actions.fetchLikutim());
      setDataLoaded(true);
    }
  }, [dispatch, err, wip, dataLoaded])

  // console.log('likutim:', language, likutim);

  // reload data on filter change
  const handleFiltersChanged = () => {
    setDataLoaded(false);
  };

  const sortedLikutim = likutim.sort((l1, l2) => l1.name < l2.name ? -1 : 1);
  const firstLetters = sortedLikutim
    .map(lk => lk.name[0])
    .filter((l, i, arr) => arr.indexOf(l) === i);

  return (
    <div>
      <SectionHeader section="likutim" />
      <Divider fitted />
      <Filters
        namespace="likutim"
        filters={filters}
        onChange={handleFiltersChanged}
        onHydrated={noop}
      />
      <Container className="padded">
        <Grid>
          <Grid.Column>
            <Card.Group stackable itemsPerRow={4}>
              {
                firstLetters.map(f =>
                  <Card key={f}>
                    <Card.Content>
                      <Card.Header as='h2' textAlign='center'>
                        {f}
                      </Card.Header>
                      <List relaxed>
                        {
                          sortedLikutim
                            .filter(sl => sl.name[0] === f)
                            .map(lu =>
                              <List.Item key={lu.id}>
                                <List.Header>
                                  <Link to={canonicalLink(lu)}>
                                    {`${lu.name} | ${t('values.date', { date: lu.film_date })}`}
                                  </Link>
                                </List.Header>
                              </List.Item>
                            )
                        }
                      </List>
                    </Card.Content>
                  </Card>
                )
              }
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  )
}

export default withNamespaces()(Main);
