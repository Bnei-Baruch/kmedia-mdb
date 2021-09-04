import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { List, Card, Grid, Divider, Container, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';

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
  const [match, setMatch] = useState('');

  const handleFilterChange = debounce((e, data) => {
    setMatch(data.value);
  }, 100);

  const handleFilterKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      setMatch('');
    }
  };

  // reload data on filter change
  const handleFiltersChanged = () => {
    setDataLoaded(false);
  };

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

  const sortedLikutim = likutim
    .filter(lk => lk.name.toLowerCase().includes(match))
    .sort((l1, l2) => l1.name < l2.name ? -1 : 1);
  const firstLetters = sortedLikutim
    .map(lk => lk.name[0])
    .filter((l, i, arr) => arr.indexOf(l) === i);

  return (
    <div>
      <SectionHeader section="likutim" />
      <Divider fitted />
      <Container className="padded">
        <Grid stackable columns={2} verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column stretched>
              <Filters
                namespace="likutim"
                filters={filters}
                onChange={handleFiltersChanged}
                onHydrated={noop}
              />
            </Grid.Column>
            <Grid.Column stretched>
              <Input
                fluid
                size="large"
                icon="search"
                className="search-omnibox"
                placeholder={t('sources-library.filter')}
                onChange={handleFilterChange}
                onKeyDown={handleFilterKeyDown}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Column>
            <Card.Group stackable itemsPerRow={4}>
              {
                firstLetters.map(fl =>
                  <Card key={fl}>
                    <Card.Content>
                      <Card.Header as='h2' textAlign='center'>
                        {fl}
                      </Card.Header>
                      <List relaxed>
                        {
                          sortedLikutim
                            .filter(sl => sl.name[0] === fl)
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
