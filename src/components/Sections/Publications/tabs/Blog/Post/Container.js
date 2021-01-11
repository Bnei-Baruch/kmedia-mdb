import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { actions, selectors } from '../../../../../../redux/modules/publications';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import Page from './Page';

const BlogPostContainer = () => {
  const wip      = useSelector(state => selectors.getBlogWipPost(state.publications));
  const err      = useSelector(state => selectors.getBlogErrorPost(state.publications));
  const language = useSelector(state => settings.getLanguage(state.settings));

  const { blog, id } = useParams();
  const post         = useSelector(state => selectors.getBlogPost(state.publications, blog, id));

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (wip || err) {
        return;
      }

      if (post
        && post.blog === blog
        && `${post.wp_id}` === id) {
        return;
      }

      dispatch(actions.fetchBlogPost(blog, id));
    },
    [id, blog, dispatch, wip, err, post]
  );

  return (
    <Page
      post={wip || err ? null : post}
      language={language}
      wip={wip}
      err={err}
    />
  );
};

export default BlogPostContainer;
