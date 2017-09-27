import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Card, Divider, Grid, Header, List, Menu, Segment } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/programs';
import { isEmpty } from '../../../helpers/utils';
import connectFilter from '../connectFilter';
import * as shapes from '../../shapes';

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
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
    allValues: [],
    genres: [],
    programs: []
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
    const selection = this.state.selection;
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

  createList = (programs, t) => {
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

  createLeftMenu = (genres, t) => {
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

  recentlyUpdated = () => (
    <Grid.Row stretched>
      <Grid.Column width={16}>
        <Header as="h6" color="grey">Recently Updated</Header>
      </Grid.Column>
      <Grid.Column>
        <Card href="#" header="Between Words" meta="A new parts added: Today" />
      </Grid.Column>
      <Grid.Column>
        <Card href="#" header="Between Words" meta="A new parts added: Today" />
      </Grid.Column>
      <Grid.Column>
        <Card href="#" header="Between Words" meta="A new parts added: Today" />
      </Grid.Column>
      <Grid.Column>
        <Card href="#" header="Between Words" meta="A new parts added: Today" />
      </Grid.Column>
      <Grid.Column>
        <Card href="#" header="Between Words" meta="A new parts added: Today" />
      </Grid.Column>

    </Grid.Row>
  );

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
                    this.recentlyUpdated()
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
  state => ({
    genres: selectors.getGenres(state.programs),
    programs: selectors.getPrograms(state.programs),
  })
)(connectFilter()(ProgramsFilter));
