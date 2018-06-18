import React from 'react';
import { Container, Header, Item } from 'semantic-ui-react';

import { sectionThumbnailFallback } from '../../../../helpers/images';
import { canonicalLink } from '../../../../helpers/links';
import { formatDuration, neighborIndices } from '../../../../helpers/utils';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import SameCollectionWidget from '../../../Pages/Unit/widgets/Recommended/SameCollection/Widget';

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
      <div className="recommended-same-collection content__aside-unit">
        <Header as="h3" content={t('lessons.unit.recommended.same-collection.title')} />
        <Item.Group divided unstackable link>
          {
            otherParts.reverse().map(part => (
              <Item
                key={part.id}
                as={Link}
                to={canonicalLink(part)}
                className="recommended-same-collection__item"
              >
                <Item.Image size="small">
                  <UnitLogo
                    unitId={part.id}
                    collectionId={collection.id}
                    width={150}
                    fallbackImg={sectionThumbnailFallback.lectures}
                  />
                </Item.Image>
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
                to={canonicalLink(collection)}
                textAlign="right"
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

export default MySameCollectionWidget;
