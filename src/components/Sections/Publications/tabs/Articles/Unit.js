import React, { Fragment, useContext, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Header } from 'semantic-ui-react';

import { actions as mdbActions } from '../../../../../redux/modules/mdb';
import Helmets from '../../../../shared/Helmets/index';
import Share from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import MediaDownloads from '../../../../Pages/WithPlayer/widgets/MediaDownloads';
import WipErr from '../../../../shared/WipErr/WipErr';
import Recommended from '../../../../Pages/WithPlayer/widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../../helpers/player';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../../../helpers/app-contexts';
import TagsByUnit from '../../../../shared/TagsByUnit';
import TextLayoutWeb from '../../../../Pages/WithText/TextLayoutWeb';
import ArticleToolbarMobile from './ArticleToolbarMobile';
import ArticleToolbarWeb from './ArticleToolbarWeb';
import { useTranslation } from 'react-i18next';
import {
  mdbGetDenormContentUnitSelector,
  mdbGetErrorsSelector,
  settingsGetUIDirSelector,
  mdbGetWipFn
} from '../../../../../redux/selectors';

const renderHeader = (unit, t, uiDir) => {
  const position = uiDir === 'rtl' ? 'right' : 'left';
  const subText2 = t(`publications.header.subtext2`);

  return (
    <div className="section-header">
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">
                <Header.Content>
                  {unit.name}
                  {
                    unit.description &&
                    <Header.Subheader>{unit.description}</Header.Subheader>
                  }
                  {
                    subText2 &&
                    <Header.Subheader className="section-header__subtitle2">
                      {subText2}
                    </Header.Subheader>
                  }
                </Header.Content>
              </Header>
              <Header as="h4" color="grey" className="display-inline">
                {t('values.date', { date: unit.film_date })}
              </Header>
              <span className="share-publication">
                <Share position={position} />
              </span>
              <TagsByUnit id={unit.id} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const renderHelmet = unit => (
  <Fragment>
    <Helmets.NoIndex />
    <Helmets.ArticleUnit unit={unit} />
  </Fragment>
);

const ArticlePage = () => {
  const { id }   = useParams();
  const location = useLocation();
  const { t }    = useTranslation();

  const chronicles         = useContext(ClientChroniclesContext);
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiDir = useSelector(settingsGetUIDirSelector);
  const unit  = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const wip   = useSelector(mdbGetWipFn).units[id];
  const err   = useSelector(mdbGetErrorsSelector).units[id];

  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || err || (unit && unit.id === id && Array.isArray(unit.files))) {
      return;
    }

    dispatch(mdbActions.fetchUnit(id));
  }, [dispatch, err, id, unit, wip]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : () => null;

  const embed = getEmbedFromQuery(location);

  const toolbar = isMobileDevice ? <ArticleToolbarMobile /> : <ArticleToolbarWeb />;

  return !embed
    ? (
      <>
        {renderHelmet(unit)}
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={10} computer={10}>
                <Grid.Row>
                  {renderHeader(unit, t, uiDir)}
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Grid padded>
                      <Grid.Row>
                        <Grid.Column>
                          <TextLayoutWeb toolbar={toolbar} />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <MediaDownloads unit={unit} displayDivider={true} chroniclesAppend={chroniclesAppend} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={6} computer={6}>
                <Recommended unit={unit} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </>
    ) : (
      renderHeader(unit, t, uiDir)
    );
};

export default ArticlePage;
