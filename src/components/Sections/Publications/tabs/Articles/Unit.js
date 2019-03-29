import React, { Fragment } from 'react';
import { Container, Grid, Header, Item } from 'semantic-ui-react';

import { canonicalLink } from '../../../../../helpers/links';
import { neighborIndices, strCmp } from '../../../../../helpers/utils';
import Link from '../../../../Language/MultiLanguageLink';
import Helmets from '../../../../shared/Helmets/index';
import { UnitContainer, wrap as wrapContainer } from '../../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../../Pages/Unit/Page';
import { SameCollectionContainer, wrap as wrapSameCollectionContainer } from '../../../../Pages/Unit/widgets/Recommended/SameCollection/Container';
import SameCollectionWidget from '../../../../Pages/Unit/widgets/Recommended/SameCollection/Widget';
import TranscriptionContainer from '../../../../Pages/Unit/widgets/UnitMaterials/Transcription/TranscriptionContainer';

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
      <div className="recommended-same-collection content__aside-unit">
        <Header as="h3" content={t('publications.unit.recommended.same-collection.title')} />
        <Item.Group divided unstackable link>
          {
            otherParts.map(part => (
              <Item
                key={part.id}
                as={Link}
                to={canonicalLink(part)}
                className="recommended-same-collection__item"
              >
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase recommended-same-collection__item-title">
                      {t('values.date', { date: part.film_date })}
                    </small>
                    <br />
                    <span className="recommended-same-collection__item-name">
                      {part.name}
                    </span>
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
                to={canonicalLink(collection)}
                textAlign="right"
              >
                {t('buttons.more')}
                &raquo;
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
    const { unit, collection, wip, err } = this.props;

    return (
      <MySameCollectionWidget
        unit={unit}
        wip={wip}
        err={err}
        collection={wip || err ? null : collection}
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
                      unit.description
                        ? <Header.Subheader>{unit.description}</Header.Subheader>
                        : null
                    }
                  </Header.Content>
                </Header>
                <Header as="h4" color="grey">
                  {t('values.date', { date: unit.film_date })}
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

  renderHelmet() {
    return (
      <Fragment>
        <Helmets.NoIndex />
        <Helmets.ArticleUnit unit={this.props.unit} />
      </Fragment>
    );
  }

  renderMaterials() {
    const { unit } = this.props;
    return (
      <TranscriptionContainer unit={unit} />
    );
  }

  renderRecommendations() {
    const { unit } = this.props;
    return <MyWrappedSameCollectionContainer unit={unit} />;
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
