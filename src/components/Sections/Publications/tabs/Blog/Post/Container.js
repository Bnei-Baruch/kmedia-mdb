import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../../../../redux/modules/publications';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Page from './Page';

export class BlogPostContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    post: shapes.BlogPost,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchPost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    post: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, post, wip, err, fetchPost } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (wip || err) {
      return;
    }

    const { blog, id } = match.params;
    if (
      post
      && post.blog === blog
      && `${post.wp_id}` === id) {
      return;
    }

    fetchPost(blog, id);
  };

  render() {
    const { language, post, wip, err } = this.props;
    return (
      <Page
        post={wip || err ? null : post}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

const mapState = (state, ownProps) => {
  const { blog, id } = ownProps.match.params;
  return {
    post: selectors.getBlogPost(state.publications, blog, id),
    wip: selectors.getBlogWipPost(state.publications),
    err: selectors.getBlogErrorPost(state.publications),
    language: settings.getLanguage(state.settings),
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchPost: actions.fetchBlogPost,
}, dispatch);

export default withRouter(connect(mapState, mapDispatch)(BlogPostContainer));
