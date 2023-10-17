'use client';
import React, { useRef } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Ref } from 'semantic-ui-react';

import TOC from './TOC';
import { selectors, textFileSlice } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import NexPrev from './NexPrev';

const LibraryLayout = ({ header, content }) => {
  const { theme, fontType, fontSize } = useSelector(state => selectors.getSettings(state.textFile));
  const tocIsActive                   = useSelector(state => selectors.getTocIsActive(state.textFile));
  const isReadable                    = useSelector(state => selectors.getIsReadable(state.textFile));

  const ref               = useRef();
  const dispatch          = useDispatch();
  const handleTocIsActive = () => dispatch(textFileSlice.actions.setTocIsActive());
  /* const getScrollTop      = () => this.state.isReadable
     ? this.articleRef.scrollTop
     : document.scrollingElement.scrollTop;*/

  return (
    <Ref innerRef={ref}>
      <div
        className={clsx({
          'headroom-z-index-801': true,
          source: true,
          'is-readable': isReadable,
          'toc--is-active': tocIsActive,
          [`is-${theme}`]: true,
          [`is-${fontType}`]: true,
        })}
      >
        {header}
        <Container>
          <Grid padded="horizontally" centered>
            <Grid.Row>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={4}
                onClick={handleTocIsActive}
              >
                <TOC />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={12}
                className={clsx({
                  'source__content-wrapper font_settings-wrapper': true,
                  [`size${fontSize}`]: true,
                })}
              >
                <div
                  className="source__content font_settings"
                  style={{ minHeight: `calc(100vh - 14px)` }}
                >
                  {content}
                  <NexPrev />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    </Ref>
  );
};

export default LibraryLayout;
