import React from 'react';
import { Container, Grid, Header, Item } from 'semantic-ui-react';

import { canonicalLink, neighborIndices, strCmp } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import { UnitContainer, wrap as wrapContainer } from '../../pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../pages/Unit/Page';
import {
  SameCollectionContainer,
  wrap as wrapSameCollectionContainer
} from '../../pages/Unit/widgets/Recommended/SameCollection/Container';
import SameCollectionWidget from '../../pages/Unit/widgets/Recommended/SameCollection/Widget';
import TranscriptionContainer from '../../pages/Unit/widgets/UnitMaterials/Transcription/TranscriptionContainer';

class MySameCollectionWidget extends SameCollectionWidget {

  renderContent() {
    const { unit, collection, t } = this.props;

    const units = [...collection.content_units];
    units.sort((a, b) => strCmp(a.film_date, b.film_date));

    const idx        = units.findIndex(x => x.id === unit.id);
    const neighbors  = neighborIndices(idx, units.length, 5);
    const otherParts = neighbors.map(x => units[x]).reverse();

    if (otherParts.length === 0) {
      return null;
    }

    return (
      <div className="content__aside-unit">
        <Header as="h3" content={t('publications.unit.recommended.same-collection.title')} />
        <Item.Group divided link>
          {
            otherParts.map(part => (
              <Item as={Link} key={part.id} to={canonicalLink(part)}>
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase">
                      {t('values.date', { date: new Date(part.film_date) })}
                    </small>
                    <br />
                    {part.name}
                  </Header>
                </Item.Content>
              </Item>
            ))
          }
          <Item>
            <Item.Content>
              <Container
                fluid
                as={Link}
                textAlign="right"
                to={canonicalLink(collection)}
              >
                {t('buttons.more')} &raquo;
              </Container>
            </Item.Content>
          </Item>
        </Item.Group>
      </div>
    );
  }
}

class MySameCollectionContainer extends SameCollectionContainer {
  render() {
    const { unit, collection, wip, err, t } = this.props;

    return (
      <MySameCollectionWidget
        unit={unit}
        wip={wip}
        err={err}
        collection={wip || err ? null : collection}
        t={t}
      />
    );
  }
}

const MyWrappedSameCollectionContainer = wrapSameCollectionContainer(MySameCollectionContainer);

class MyUnitPage extends UnitPage {

  renderPlayer() {
    const { unit, t } = this.props;
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
                      unit.description ?
                        <Header.Subheader>{unit.description}</Header.Subheader> :
                        null
                    }
                  </Header.Content>
                </Header>
                <Header as="h4" color="grey">
                  {t('values.date', { date: new Date(unit.film_date) })}
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }

  renderInfo() {
    return null;
  }

  renderMaterials() {
    const { unit, t } = this.props;
    return (
      <TranscriptionContainer unit={unit} t={t} />
    );
  }

  renderRecommendations() {
    const { unit, t } = this.props;
    return <MyWrappedSameCollectionContainer unit={unit} t={t} />;
  }
}

const MyWrappedUnitPage = wrapPage(MyUnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <MyWrappedUnitPage
        section="publications"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);
