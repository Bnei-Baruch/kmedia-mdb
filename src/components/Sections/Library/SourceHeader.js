import { Header, Container, Grid, Button } from 'semantic-ui-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as sources } from '../../../../lib/redux/slices/sourcesSlice';
import FilterSource from './FilterSource';
import SortingOrder from './SortingOrder';
import SourceHeaderTitle from './HeaderTitle';
import LibraryBar from './LibraryBar';
import { buildBookmarkSource, buildLabelData, parentIdByPath } from './helper';
import Headroom from 'react-headroom';
import { textFileSlice } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import { useTranslation } from 'next-i18next';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice';

const SourceHeader = ({ id }) => {
  const source   = useSelector(state => sources.getSourceById(state.sources)(id));
  const uiLang   = useSelector(state => settings.getUILang(state.settings));
  const path     = useSelector(state => sources.getPathByID(state.sources)(id));
  const parentId = parentIdByPath(path);
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleTocIsActive = () => dispatch(textFileSlice.actions.setTocIsActive());

  return (
    <Headroom>
      <div className="layout__secondary-header">
        <Container>
          <Grid padded centered>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column mobile={16} tablet={16} computer={4} className="source__toc-header">
                <div className="source__header-title mobile-hidden">
                  <Header size="small">{t('sources-library.toc')}</Header>
                </div>
                <div className="source__header-toolbar">
                  <FilterSource parentId={parentId} />
                  <SortingOrder parentId={parentId} />
                  <Button
                    compact
                    size="small"
                    className="computer-hidden large-screen-hidden widescreen-hidden"
                    icon="list layout"
                    onClick={handleTocIsActive}
                  />
                </div>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={12} className="source__content-header">
                <SourceHeaderTitle id={id} parentId={parentId} />
                <LibraryBar
                  // DON'T MERGE BEFORE FIXING THIS
                  // Not sure why contentLanguage is being used here at all!
                  source={{ language: uiLang, ...buildBookmarkSource(id) }}
                  label={{ language: uiLang, ...buildLabelData(id) }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    </Headroom>
  );
};

export default SourceHeader;
