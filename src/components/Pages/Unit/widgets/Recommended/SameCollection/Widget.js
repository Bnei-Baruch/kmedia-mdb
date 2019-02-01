import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Header, Item } from 'semantic-ui-react';

import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, neighborIndices } from '../../../../../../helpers/utils';
import { sectionThumbnailFallback } from '../../../../../../helpers/images';
import * as shapes from '../../../../../shapes';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';
import WipErr from '../../../../../shared/WipErr/WipErr';

class SameCollection extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    section: '',
  };

  renderContent() {
    const { unit, collection, section, t } = this.props;

    const idx        = collection.content_units.findIndex(x => x.id === unit.id);
    const neighbors  = neighborIndices(idx, collection.content_units.length, 3);
    const otherParts = neighbors.map(x => collection.content_units[x]);

    if (otherParts.length === 0) {
      return null;
    }

    return (
      <div className="recommended-same-collection content__aside-unit">
        <Header as="h3" content={t(`${section || 'pages'}.unit.recommended.same-collection.title`)} />
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
                    fallbackImg={sectionThumbnailFallback.programs}
                  />
                </Item.Image>
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase recommended-same-collection__item-title">
                      {t(`${section || 'pages'}.unit.recommended.same-collection.item-title`, { name: collection.ccuNames[part.id] })} - {t('values.date', { date: part.film_date })}
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

  render() {
    const { collection, wip, err, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!collection || !Array.isArray(collection.content_units)) {
      return null;
    }

    return this.renderContent();
  }
}

export default withNamespaces()(SameCollection);
