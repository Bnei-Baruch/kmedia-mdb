import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { List, Card, Grid, Divider, Container } from 'semantic-ui-react';
import debounce from 'lodash/debounce';

import { actions, selectors } from '../../../redux/modules/likutim';
import { selectors as settings } from '../../../redux/modules/settings';
import { canonicalLink } from '../../../helpers/links';
import { noop, strCmp } from '../../../helpers/utils';
import { getFirstLetter } from '../../../helpers/strings';

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
  const [clickedLetter, setClickedLetter] = useState(null);

  const handleSearch = debounce((e, data) => {
    setMatch(data?.value);
  }, 100);

  const handleClear = () => setMatch('');

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
    .filter(lk => lk.name.toLowerCase().includes(match.toLowerCase()))
    .sort((l1, l2) => strCmp(l1.name, l2.name));

  // creates a Map - key value structure of (likut, first letter of likut name)
  const firstLettersMap = useMemo(() => {
    const flMap = new Map();

    sortedLikutim.forEach(lk => {
      flMap.set(lk.id, getFirstLetter(lk.name));
    });

    return flMap;
  }, [sortedLikutim]);

  const firstLetters = sortedLikutim
    .map(lk => firstLettersMap.get(lk.id))
    .filter((l, i, arr) => arr.indexOf(l) === i);

  // clicked letter filtering
  let selectedFirstLetters;
  let displayedLikutim;
  if (clickedLetter) {
    selectedFirstLetters = firstLetters.filter(lt => lt === clickedLetter);
    displayedLikutim = sortedLikutim.filter(lk => firstLettersMap.get(lk.id) === clickedLetter)
  } else {
    selectedFirstLetters = firstLetters.sort();
    displayedLikutim = sortedLikutim;
  }

  const onLetterClick = letter => {
    setClickedLetter(letter);
  }

  return (
    <div>
      <SectionHeader section="likutim" />
      <Divider fitted />
      <Filters
        namespace="likutim"
        filters={filters}
        onChange={handleFiltersChanged}
        onSearch={handleSearch}
        onClear={handleClear}
        onHydrated={noop}
        onLetterClick={onLetterClick}
        letters={firstLetters}
      />
      <Container className="padded">
        <Grid>
          <Grid.Column>
            <Card.Group stackable itemsPerRow={4}>
              {
                selectedFirstLetters.map(fl =>
                  <Card key={fl}>
                    <Card.Content>
                      <Card.Header as='h2' textAlign='center'>
                        {fl}
                      </Card.Header>
                      <List relaxed>
                        {
                          displayedLikutim
                            .filter(dlk => firstLettersMap.get(dlk.id) === fl)
                            .map(lk =>
                              <List.Item key={lk.id} className="topics__item-font">
                                <Link to={canonicalLink(lk)} >{lk.name} </Link>
                                <span className="topics__item-smaller-font">
                                    | {t('values.date', { date: lk.film_date })}
                                </span>
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
