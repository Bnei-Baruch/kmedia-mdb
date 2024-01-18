import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { actions } from '../../../../../../redux/modules/publications';
import Page from './Page';
import { publicationsGetBlogErrorSelector, publicationsGetBlogPostSelector, publicationsGetBlogWipSelector } from '../../../../../../redux/selectors';

const BlogPostContainer = () => {
  const wip = useSelector(publicationsGetBlogWipSelector);
  const err = useSelector(publicationsGetBlogErrorSelector);

  const { blog, id } = useParams();
  const post         = useSelector(state => publicationsGetBlogPostSelector(state, blog, id));

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
      wip={wip}
      err={err}
    />
  );
};

export default BlogPostContainer;
