import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Menu, Segment, Grid, Container, Header, Card, List } from 'semantic-ui-react';

import { selectors as sources } from '../../../redux/modules/sources';
import connectFilter from '../connectFilter';

class SourcesFilter extends React.Component {

  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    getSourceById: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    allValues: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
  };

  static defaultProps = {
    roots: [],
    onCancel: noop,
    onApply: noop,
    value: [],
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

  componentDidUpdate() {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth     = data['data-depth'];

    const { selection: oldSelection } = this.state;
    const newSelection                = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);
    this.setState({ selection: newSelection });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    const selection = this.state.selection;
    if (Array.isArray(selection) && selection.length === 0) {
      return;
    }
    this.props.updateValue(selection);
    this.props.onApply();
  };

  // Return all lists of selected sources.
  createLists = (depth, items, selection, otherSelected) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    if (selection.length === 0) {
      return [this.createList(depth, items, '', otherSelected.map(s => s[0]))];
    }

    const selected = this.props.getSourceById(selection[0]);
    const current  = this.createList(depth, items, selection[0], otherSelected.map(s => s[0]));
    let next       = [];
    if (selected && selected.children) {
      next = this.createLists(depth + 1, selected.children, selection.slice(1), otherSelected.filter(s => s.length > 0).map(s => s.slice(1)));
    }

    return [current].concat(next);
  };

  createList = (depth, items, selectedId, otherSelectedIds) => {
    const { getSourceById } = this.props;
    return (
      <div key={selectedId} className="filter-steps__column-wrapper">
        <div className="filter-steps__column">
          <Menu fluid vertical color="blue" size="tiny">
            {
              items.map((x) => {
                const node  = getSourceById(x);
                const style = otherSelectedIds.includes(x) && selectedId !== x ?
                  { backgroundColor: 'lightgoldenrodyellow' } :
                  {};

                return (
                  <Menu.Item
                    key={x}
                    value={x}
                    active={selectedId === x}
                    data-depth={depth}
                    onClick={this.onSelectionChange}
                    style={style}
                  >
                    {node.name}
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>
      </div>
    );
  };

  render() {
    const { roots, t } = this.props;

    return (
      <Container className='padded-horizontally'>
        <Segment vertical className="tab active" style={{
          padding: '0'
        }}>
          <div className="filter-steps">
            <div className="filter-steps__column-wrapper">
              <div className="filter-steps__column">
                <Menu vertical color='blue' size='tiny' fluid>
                  <Menu.Item active>All Programms</Menu.Item>
                  <Menu.Item>Children</Menu.Item>
                  <Menu.Item>Talk Show</Menu.Item>
                  <Menu.Item>Late Night</Menu.Item>
                </Menu>
              </div>
            </div>
            <div className="filter-steps__column-wrapper">
              <div className="filter-steps__column">
                <Grid padded className="filter-steps__lists" columns={5}>
                  <Grid.Row stretched>
                    <Grid.Column width={16}>
                      <Header as='h6' color='grey'>Recently Updated</Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Card
                        href='#'
                        header='Between Words'
                        meta='A new parts added: Today'
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Card
                        href='#'
                        header='Between Words'
                        meta='A new parts added: Today'
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Card
                        href='#'
                        header='Between Words'
                        meta='A new parts added: Today'
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Card
                        href='#'
                        header='Between Words'
                        meta='A new parts added: Today'
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Card
                        href='#'
                        header='Between Words'
                        meta='A new parts added: Today'
                      />
                    </Grid.Column>

                  </Grid.Row>
                  <Grid.Row >
                    <Grid.Column width={16}>
                      <Header as='h6' color='grey'>All Programs</Header>

                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>#<Divider/></List.Header></List.Item>
                        <List.Item>20 Ideas</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>A<Divider/></List.Header></List.Item>
                        <List.Item>A New Life</List.Item>
                        <List.Item>A New Life. Excerpts</List.Item>
                        <List.Item>A Point in the Heart</List.Item>
                        <List.Item inverted>A song from the source</List.Item>
                        <List.Item>A Song Out of the Sleeve</List.Item>
                        <List.Item>A Spiritual Story with Eran Kurtz</List.Item>
                        <List.Item>A Taste of Light</List.Item>
                        <List.Item>All together</List.Item>
                        <List.Item>Among Friends</List.Item>
                        <List.Item>Ask the Kabbalist</List.Item>
                        <List.Item>Ask the kabbalist</List.Item>
                        <List.Item>At six on 66</List.Item>
                        <List.Item>Audio Program</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>

                      <List size='tiny'>
                        <List.Item><List.Header>B<Divider/></List.Header></List.Item>
                        <List.Item>Babylon Yesterday and Today</List.Item>
                        <List.Item>Backstage with</List.Item>
                        <List.Item>Basics</List.Item>
                        <List.Item>Behind the Words</List.Item>
                        <List.Item>Between Parents and Children</List.Item>
                        <List.Item>Between Us</List.Item>
                        <List.Item>Between Words</List.Item>
                        <List.Item>Book about Israel</List.Item>
                        <List.Item>Business and the new reality</List.Item>
                        <List.Item>Butterfly Effect</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>C<Divider/></List.Header></List.Item>
                        <List.Item>Child's Play</List.Item>
                        <List.Item>Children's World</List.Item>
                        <List.Item>Closeup</List.Item>
                        <List.Item>Company</List.Item>
                        <List.Item>Connecting for Good</List.Item>
                        <List.Item>Conversations with Kabbalist</List.Item>
                        <List.Item>Crossroads</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>E<Divider/></List.Header></List.Item>
                        <List.Item>Education Issues</List.Item>
                        <List.Item>Essentials of education</List.Item>
                        <List.Item>Experts</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>F<Divider/></List.Header></List.Item>
                        <List.Item>Films</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>G<Divider/></List.Header></List.Item>
                        <List.Item>Getting ready for the congress</List.Item>
                        <List.Item>Global Village</List.Item>
                        <List.Item>Good environment</List.Item>
                        <List.Item>Good time</List.Item>
                        <List.Item>Great Kabbalists</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List size='tiny'>
                        <List.Item><List.Header>H<Divider/></List.Header></List.Item>
                        <List.Item>Hasidism</List.Item>
                        <List.Item>Hot Topic</List.Item>
                        <List.Item>HR Secrets Revealed</List.Item>
                      </List>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>


              </div>
            </div>
          </div>
        </Segment>
        <Segment vertical clearing>
          <Button primary content='Apply' floated="right" />
          <Button content='Cancel' floated="right" />
        </Segment>
      </Container>
      // <div>
      //   <Segment vertical className="tab active" style={{
      //     padding: '0'
      //   }}>
      //     <div
      //       className="filter-steps"
      //       // eslint-disable-next-line no-return-assign
      //       ref={el => this.listContainer = el}
      //     >
      //       {
      //         roots.length > 0 ?
      //           this.createLists(0, roots, this.state.selection, this.props.allValues).map(l => l) :
      //           'No Sources'
      //       }
      //     </div>
      //   </Segment>
      //   <Segment vertical clearing>
      //     <Button primary content={t('buttons.apply')} floated="right" onClick={this.apply} />
      //     <Button content={t('buttons.cancel')} floated="right" onClick={this.onCancel} />
      //   </Segment>
      // </div>
    );
  }
}

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(connectFilter()(EventsFilter));
