import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/mdb';
import { selectors as settings } from '../../../../../redux/modules/settings';
import Helmets from '../../../../shared/Helmets/index';
import TranscriptionContainer from '../../../../Pages/Unit/widgets/UnitMaterials/Transcription/TranscriptionContainer';
import Share from "../../../Library/Share";
import { isLanguageRtl } from "../../../../../helpers/i18n-utils";
import MediaDownloads from '../../../../Pages/Unit/widgets/Downloads/MediaDownloads';
import WipErr from '../../../../shared/WipErr/WipErr';
import Recommended from '../../../../Pages/Unit/widgets/Recommended/Main/Recommended';
import playerHelper from '../../../../../helpers/player';


const renderHeader = (unit, t, language) => {
  const isRtl = isLanguageRtl(language);
  const position = isRtl ? 'right' : 'left';
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

const renderHelmet = unit => (
  <Fragment>
    <Helmets.NoIndex />
    <Helmets.ArticleUnit unit={unit} />
  </Fragment>
);

const renderArticle = unit => (
  <Grid padded>
    <Grid.Row>
      <Grid.Column>
        <TranscriptionContainer unit={unit} />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <MediaDownloads unit={unit} displayDivider={true} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

const ArticlePage = ({ t }) => {
  const location = useLocation();
  const { id } = useParams();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const unit = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err = useSelector(state => selectors.getErrors(state.mdb).units[id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || err || (unit && unit.id === id && Array.isArray(unit.files))) {
      console.log('no need to fetch:', id, wip, err);
      return;
    }

    dispatch(actions.fetchUnit(id));
  }, [dispatch, err, id, unit, wip])

  console.log('unit:', id, language, unit);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  const embed = playerHelper.getEmbedFromQuery(location);

  return !embed
    ? (
      <>
        {renderHelmet(unit)}
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={10} computer={10}>
                <Grid.Row>
                  {renderHeader(unit, t, language)}
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    {renderArticle(unit)}
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
      renderHeader(unit, t, language)
    );
}

ArticlePage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ArticlePage);