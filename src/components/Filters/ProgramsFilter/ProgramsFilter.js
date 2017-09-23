import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Divider, Menu, Segment } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/programs';
import connectFilter from '../connectFilter';

class ProgramsFilter extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
    allValues: [],
  };

  state = {
    selection: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selection: nextProps.value
    });
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    this.setState({ selection: value });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    const selection = this.state.selection;
    if (selection === null) {
      return;
    }
    this.props.updateValue(selection);
    this.props.onApply();
  };

  filterProgramsByGenre = (genre, programs) => {
    if (genre === null) {
      return programs;
    }

    const filteredProgram = programs.filter(
      program => program
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

    const programsTree = {};

    // 2. Build tree of programs
    let key = 0;
    filteredProgram.forEach((program) => {
      let firstLetter = program.name.charAt(0);
      if ([...'0123456789'].includes(firstLetter)) {
        firstLetter = '#';
      }
      if (programsTree[firstLetter] === undefined) {
        programsTree[firstLetter] = [];
      }
      programsTree[firstLetter].push({ key, program });
      key++;
    });

    return programsTree;
  };

  createList = (genre, programs) => {
    const progs = this.filterProgramsByGenre(genre, programs);
    return '';
  };

  createLeftMenu = (genres, selected) => (
    <Menu vertical color="blue" size="tiny" fluid>
      <Menu.Item
        key={0}
        value={'all'}
        active={selected === 0}
        onClick={this.onSelectionChange}
      >All Programs</Menu.Item>
      {
        genres.map(
          (genre) => {
            const active = selected === genre;
            const style  = active ?
              { backgroundColor: 'lightgoldenrodyellow' } :
              {};

            return (
              <Menu.Item
                key={genre}
                value={genre}
                style={style}
                active={active}
                onClick={this.onSelectionChange}
              >{genre}</Menu.Item>
            );
          })
      }
    </Menu>
  );

  render() {
    const { t, genres, programs } = this.props;

    return (
      <Segment basic clearing attached="bottom" className="tab active">
        <div className="filter-steps">
          <div className="filter-steps__column-wrapper">
            <div className="filter-steps__column">
              {
                this.createLeftMenu(genres, this.state.selection)
              }
            </div>
          </div>
          <div className="filter-steps__column-wrapper">
            <div className="filter-steps__column">
              {
                this.createList(this.state.selection, programs)
              }
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
