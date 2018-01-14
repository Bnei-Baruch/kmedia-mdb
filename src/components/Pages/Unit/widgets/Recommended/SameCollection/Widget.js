import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Item } from 'semantic-ui-react';

import { canonicalLink, formatDuration, neighborIndices } from '../../../../../../helpers/utils';
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
      <div className="content__aside-unit">
        <Header as="h3" content={t(`${section || 'pages'}.unit.recommended.same-collection.title`)} />
        <Item.Group divided link>
          {
            otherParts.reverse().map(part => (
              <Item as={Link} key={part.id} to={canonicalLink(part)}>
                <Item.Image size="small">
                  <UnitLogo unitId={part.id} collectionId={collection.id} width={150} />
                </Item.Image>
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase">
                      {t(`${section || 'pages'}.unit.recommended.same-collection.item-title`, { name: collection.ccuNames[part.id] })} - {t('values.date', { date: new Date(part.film_date) })}
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

export default SameCollection;
