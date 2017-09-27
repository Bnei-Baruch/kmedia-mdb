import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Card, Divider, Grid, Header, List, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { selectors } from '../../../redux/modules/programs';
import { isEmpty } from '../../../helpers/utils';
import connectFilter from '../connectFilter';

class ProgramsFilter extends React.Component {

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
    selection: { genre: null, program: null, ...this.props.value }
  };

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.value)) {
      return;
    }
    this.setState({
      selection: nextProps.value
    });
  }

  onSelectionGenreChange = (event, data) => {
    const { value } = data;
    this.setState({ selection: value });
  };

  onSelectionProgramChange = (event, data) => {
    const { value } = data;
    this.setState({
      selection: {
        ...this.state.selection,
        program: value
      }
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    const selection = this.state.selection;
    if (selection === null || (selection.genre === null && selection.program === null)) {
      return;
    }
    this.props.updateValue(selection);
    this.props.onApply();
  };

  filterProgramsByGenre = (genre, programs) => {
    let filter;
    if (isEmpty(genre)) {
      filter = program => program;
    } else {
      filter = program => program.genres.includes(genre);
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

  createList = (programs) => {
    const { genre, program } = this.state.selection;
    const filteredPrograms   = this.filterProgramsByGenre(genre, programs);
    const header             = genre || 'All Programs';

    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Header as="h6" color="grey">{header}</Header>
        </Grid.Column>
        {
          Object.keys(filteredPrograms).map((key) => {
            const programArr = filteredPrograms[key];

            return (
              <Grid.Column key={`PL${key}`}>
                <List size="tiny">
                  <List.Item><List.Header>{key}<Divider /></List.Header></List.Item>
                  {
                    programArr.map(prog => (
                      <List.Item
                        key={`PF${prog.program.id}`}
                        value={prog.program.id}
                        active={prog.program.id === program}
                        style={prog.program.id === program ? { backgroundColor: 'lightgoldenrodyellow' } : {}}
                        onClick={this.onSelectionProgramChange}
                      >{prog.program.name}</List.Item>
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

  createLeftMenu = (genres) => {
    const selected      = this.state.selection;
    const selectedGenre = selected ? selected.genre : null;
    return (<Menu vertical color="blue" size="tiny" fluid>
      <Menu.Item
        key={0}
        value={null}
        style={selectedGenre === null ?
          { backgroundColor: 'lightgoldenrodyellow' } :
          {}}
        active={selected === 0}
        onClick={this.onSelectionGenreChange}
      >All Programs</Menu.Item>
      {
        genres.map(
          (genre) => {
            const active = selectedGenre === genre;
            const style  = active ?
              { backgroundColor: 'lightgoldenrodyellow' } :
              {};

            return (
              <Menu.Item
                key={genre}
                value={{ genre }}
                style={style}
                active={active}
                onClick={this.onSelectionGenreChange}
              >{genre}</Menu.Item>
            );
          })
      }
    </Menu>);
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
              {
                this.createLeftMenu(genres)
              }
            </div>
          </div>
          <div className="filter-steps__column-wrapper">
            <div className="filter-steps__column">
              <Grid padded className="filter-steps__lists" columns={5}>
                {
                  this.state.selection === { genre: null, programs: null } ? null : this.recentlyUpdated()
                }
                {
                  this.createList(programs)
                }
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
