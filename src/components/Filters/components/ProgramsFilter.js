import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Card, Divider, Grid, Header, List, Menu, Segment } from 'semantic-ui-react';

import { canonicalLink, isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/programs';
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';
import connectFilter from './connectFilter';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

class ProgramsFilter extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.shape({
      genre: PropTypes.string,
      program: PropTypes.string,
    }),
    t: PropTypes.func.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string),
    programs: PropTypes.arrayOf(shapes.ProgramCollection),
    recentlyUpdated: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      last_update: PropTypes.string.isRequired,
      units_count: PropTypes.number.isRequired,
      collection: shapes.ProgramCollection,
    })),
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
    allValues: [],
    genres: [],
    programs: [],
    recentlyUpdated: [],
  };

  state = {
    selection: this.props.value,
  };

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.value)) {
      this.setState({ selection: nextProps.value });
    }
  }

  onSelectionGenreChange = (event, data) => {
    this.setState({ selection: data.value });
  };

  onSelectionProgramChange = (event, data) => {
    this.setState({
      selection: {
        ...this.state.selection,
        program: data.value,
      }
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    const { selection } = this.state;
    if (!isEmpty(selection)) {
      this.props.updateValue(selection);
      this.props.onApply();
    }
  };

  filterProgramsByGenre = (genre, programs) => {
    let filter;
    if (isEmpty(genre)) {
      filter = program => program;
    } else {
      filter = program => Array.isArray(program.genres) && program.genres.includes(genre);
    }

    const filteredProgram = programs.filter(
      filter
    ).sort(
      (a, b) => {
        const nameA = a.name.charAt(0).toLowerCase();
        const nameB = b.name.charAt(0).toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
    );

    // Build tree of programs
    let key = 0;
    return filteredProgram.reduce((acc, program) => {
      let firstLetter = program.name.charAt(0);
      if ([...'0123456789'].includes(firstLetter)) {
        firstLetter = '#';
      }
      if (acc[firstLetter] === undefined) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ key, program });
      key++;
      return acc;
    }, []);
  };

  createList = () => {
    const { programs, t }    = this.props;
    const { genre, program } = this.state.selection || {};
    const filteredPrograms   = this.filterProgramsByGenre(genre, programs);
    const header             = t(`programs.genres.${genre || 'all'}`);

    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Header as="h6" color="grey" content={header} />
        </Grid.Column>
        {
          Object.keys(filteredPrograms).map((key) => {
            const programArr = filteredPrograms[key];

            return (
              <Grid.Column key={`PL${key}`}>
                <List size="tiny">
                  <List.Item>
                    <List.Header>
                      {key}
                      <Divider />
                    </List.Header>
                  </List.Item>
                  {
                    programArr.map(prog => (
                      <List.Item
                        key={`PF${prog.program.id}`}
                        value={prog.program.id}
                        active={prog.program.id === program}
                        style={prog.program.id === program ? { backgroundColor: 'lightgoldenrodyellow' } : {}}
                        onClick={this.onSelectionProgramChange}
                        content={prog.program.name}
                      />
                    ))
                  }
                </List>
              </Grid.Column>
            );
          })
        }
      </Grid.Row>
    );
  };

  createLeftMenu = () => {
    const { genres, t } = this.props;
    const selected      = this.state.selection;
    const selectedGenre = selected ? selected.genre : null;
    return (
      <Menu vertical color="blue" size="tiny" fluid>
        <Menu.Item
          key={0}
          value={null}
          style={selectedGenre === null ? { backgroundColor: 'lightgoldenrodyellow' } : {}}
          active={selected === 0}
          onClick={this.onSelectionGenreChange}
          content={t('programs.genres.all')}
        />
        {
          genres
            .filter(x => !!x)
            .map((genre) => {
              const active = selectedGenre === genre;
              const style  = active ? { backgroundColor: 'lightgoldenrodyellow' } : {};
              return (
                <Menu.Item
                  key={genre}
                  value={{ genre }}
                  style={style}
                  active={active}
                  onClick={this.onSelectionGenreChange}
                  content={t(`programs.genres.${genre}`)}
                />
              );
            })
        }
      </Menu>
    );
  };

  createRecentlyUpdated = () => {
    const { recentlyUpdated, language, t } = this.props;

    if (!Array.isArray(recentlyUpdated)) {
      return null;
    }

    return (
      <Grid.Row stretched>
        <Grid.Column width={16}>
          <Header as="h6" color="grey" content={t('filters.programs-filter.recently-updated')} />
        </Grid.Column>
        {
          recentlyUpdated.slice(0, 5)
            .filter(x => x.collection)
            .map((x) => {
              const { collection, last_update: lastUpdate } = x;
              return (
                <Grid.Column key={x.id}>
                  <Card
                    as={Link}
                    to={canonicalLink(collection)}
                    language={language}
                    header={collection.name}
                    meta={`${t('filters.programs-filter.last-updated')}: ${t('values.date', { date: lastUpdate })}`}
                  />
                </Grid.Column>
              );
            })
        }
      </Grid.Row>
    );
  };

  render() {
    const { t, genres, programs } = this.props;

    return (
      <Segment basic clearing attached="bottom" className="tab active">
        <div className="filter-steps">
          <div className="filter-steps__column-wrapper">
            <div className="filter-steps__column">
              {this.createLeftMenu(genres, t)}
            </div>
          </div>
          <div className="filter-steps__column-wrapper">
            <div className="filter-steps__column">
              <Grid padded className="filter-steps__lists" columns={5}>
                {
                  this.state.selection ?
                    null :
                    this.createRecentlyUpdated(t)
                }
                {this.createList(programs, t)}
              </Grid>
            </div>
          </div>
        </div>
        <Divider />
        <Segment vertical clearing>
          <Button primary content={t('buttons.apply')} floated="right" onClick={this.apply} />
          <Button content={t('buttons.cancel')} floated="right" onClick={this.onCancel} />
        </Segment>
      </Segment>
    );
  }
}

export default connect(
  (state) => {
    const recentlyUpdated = selectors.getRecentlyUpdated(state.programs)
      .map(x => (
        {
          ...x,
          collection: mdbSelectors.getCollectionById(state.mdb, x.id),
        }
      ));

    return {
      genres: selectors.getGenres(state.programs),
      programs: selectors.getPrograms(state.programs),
      recentlyUpdated,
    };
  }
)(connectFilter()(ProgramsFilter));
