import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as lessonActions from '../actions/lessonActions';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page_no     : 1,
      page_size   : 10,
      language    : 'ru',
      total       : '...',
      loading     : false,
      activeFilter: null
    };
  }

  componentDidMount() {
    this.loadPage(this.props.location.search);
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      page = parseInt(search.match(/page=(\d+)/)[1], 10);
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  loadPage = (search) => {
    if (this.state.loading) {
      return;
    }

    const pageNo = this.getPageNo(search);

    this.setState({ loading: true });

    this.props.actions.loadLessons({
      language : this.state.language,
      page_no  : pageNo,
      page_size: this.state.page_size
    });
  };

  render() {
    const { total, collections } = this.props.lessons;
    return <div>Lessons: {collections.length} of {total}</div>;
  }
}

LessonsIndex.propTypes = {
  lessons : PropTypes.shape({
    total      : PropTypes.number.isRequired,
    collections: PropTypes.arrayOf(
      PropTypes.shape({
        id           : PropTypes.string.isRequired,
        film_date    : PropTypes.string.isRequired,
        content_type : PropTypes.string.isRequired,
        content_units: PropTypes.arrayOf(
          PropTypes.shape({
            id         : PropTypes.string.isRequired,
            name       : PropTypes.string.isRequired,
            description: PropTypes.string,
          })
        ).isRequired,
      })
    ).isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  actions : PropTypes.shape({
    loadLessons: PropTypes.func.isRequired
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('mapStateToProps');
  return {
    lessons: state.root.lessons || []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(lessonActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsIndex);
