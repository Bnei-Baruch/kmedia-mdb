import React  from 'react';
import { Segment, Menu, Header, Grid, Container } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

import Routes from './router'
import MenuItems from './menu';
import { FetchCollections, LESSONS } from './fetch';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page_no     : 1,
      page_size   : 10,
      language    : 'ru',
      lessons     : [],
      total       : '...',
      loading     : false,
      activeFilter: null
    };
  }

  handleFilterClick = ({ name }) => this.setState({ activeFilter: name });

  handleDataFetch = (params, { total, collections }) => {
    this.setState({
      total,
      lessons: collections,
      page_no: params.page_no,
      loading: false
    })
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      page = parseInt(search.match(/page=(\d+)/)[1], 10);
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  }

  componentWillReceiveProps(props) {
    this.loadPage(this.getPageNo(props.location.search));
  }

  componentDidMount() {
    this.loadPage(this.getPageNo(this.props.location.search));
  }

  loadPage = (page_no) => {
    if (this.state.loading) {
      return;
    }
    console.log('Loading', page_no);

    this.setState({ loading: true },
      () => FetchCollections({
        content_type: LESSONS,
        language    : this.state.language,
        page_no,
        page_size   : this.state.page_size
      }, this.handleDataFetch)
    );
  }

  render() {
    const state = this.state;

    return (
      <Grid columns='equal' className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple routes={Routes} />
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header as="h3">
                    Results {(state.page_no - 1) * state.page_size + 1} - {state.page_no * state.page_size + 1}
                    &nbsp;of {state.total}</Header>
                  <FilterMenu active={state.activeFilter} handler={this.handleFilterClick} />
                  <ActiveFilter filter={state.activeFilter} />
                  <Pagination loadPage={this.loadPage} totalPages={state.total} />
                  <Lessons loading={state.loading} lessons={state.lessons} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

// FILTERS

const ActiveFilter = ({ filter }) => {
  switch (filter) {
  case 'date-filter':
    return <DateFilter />
  case 'sources-filter':
    return <Segment basic attached="bottom" className="tab active">Second</Segment>
  case 'topic-filter':
    return <Segment basic attached="bottom" className="tab active">Third</Segment>
  default:
    return <span />
  }
}

const DateFilter = () => {
  return <Segment basic attached="bottom" className="tab active">First</Segment>
}

const FilterMenu = (props) => {
  return (
    <Menu secondary pointing color="violet" className="index-filters">
      <Menu.Header className="item">Filter by:</Menu.Header>
      <FilterMenuItem name="date" title="Date" {...props} />
      <FilterMenuItem name="sources" title="Sources" {...props} />
      <FilterMenuItem name="topic" title="Topics" {...props} />
    </Menu>
  )
}

const FilterMenuItem = ({ name, title, active, handler }) => {
  const full_name = `${name}-filter`;
  return (
    <Menu.Item name={full_name} active={active === full_name} onClick={() => handler({ name: full_name })}>{title}</Menu.Item>
  )
}

// LESSONS

const Lessons = (props) => {
  if (props.loading) {
    return <Segment>Loading...</Segment>
  }

  const lessons = props.lessons.map((lesson) => {
    const units = lesson.content_units.map((unit) => (
      <Container as="div" key={`u-${unit.id}`}><Link to={`/lessons/${unit.id}`}>{unit.name}<br />{unit.description}
      </Link></Container>
    ));

    return (
      <Grid.Row key={`l-${lesson.id}`} stretched verticalAlign="top">
        <Grid.Column width={2}><a><b>{lesson.film_date}</b></a></Grid.Column>
        <Grid.Column width={14}>
          <Grid.Column>
            <a><b>{lesson.content_type}</b></a>
            {units}
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
    )
  });

  return (<Segment><Grid columns={2} divided="vertically">{lessons}</Grid></Segment>);
}

// PAGINATION

const Pagination = ({ loadPage, totalPages }) => {
  if (totalPages === '...') {
    return <Segment />;
  }

  if (totalPages > 10) {
    totalPages = 10;
  }
  const menu = [...Array(totalPages).keys()].map(id =>
    <Menu.Item as={NavLink} activeClassName="active violet" key={`page-${id + 1}`} to={{
      pathname: '/lessons',
      search  : `?page=${id + 1}`
    }}>&nbsp;{id + 1}</Menu.Item>
  );

  return (
    <Segment> Pages:
      {menu}
    </Segment>
  )
}

export default LessonsIndex;
