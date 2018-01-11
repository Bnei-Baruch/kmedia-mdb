import React from 'react';
import { Container, Header, Item } from 'semantic-ui-react';

import { canonicalLink, formatDuration, neighborIndices } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import { UnitContainer, wrap as wrapContainer } from '../../pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../pages/Unit/Page';
import {
  SameCollectionContainer,
  wrap as wrapSameCollectionContainer
} from '../../pages/Unit/widgets/Recommended/SameCollection/Container';
import Info from '../../pages/Unit/widgets/Info/Info';
import SameCollectionWidget from '../../pages/Unit/widgets/Recommended/SameCollection/Widget';

class MySameCollectionWidget extends SameCollectionWidget {

  renderContent() {
    const { unit, collection, t } = this.props;

    const idx        = collection.content_units.findIndex(x => x.id === unit.id);
    const neighbors  = neighborIndices(idx, collection.content_units.length, 3);
    const otherParts = neighbors.map(x => collection.content_units[x]);

    if (otherParts.length === 0) {
      return null;
    }

    return (
      <div className="content__aside-unit">
        <Header as="h3" content={t('events.unit.recommended.same-collection.title')} />
        <Item.Group divided link>
          {
            otherParts.map(part => (
              <Item as={Link} key={part.id} to={canonicalLink(part)}>
                <Item.Image size="small">
                  <UnitLogo unitId={part.id} collectionId={collection.id} width={150} />
                </Item.Image>
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase">
                      {t('values.date', { date: new Date(part.film_date) })}
                    </small>
                    <br />
                    {part.name}
                  </Header>
                  <Item.Meta>
                    <small>{formatDuration(part.duration)}</small>
                  </Item.Meta>
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

  renderInfo() {
    const { unit, t } = this.props;
    return <Info unit={unit} section={''} t={t} />;
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
        section="events"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);
