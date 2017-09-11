import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import AVPlaylistPlayerRMP from '../../AVPlayerRMP/AVPlaylistPlayerRMP';

class FullVideoBox extends Component {

  static propTypes = {
    PlayListComponent: PropTypes.any,
    language: PropTypes.string.isRequired,
    collection: shapes.GenericCollection.isRequired,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
    PlayListComponent: null
  };

  handlePartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  render() {
    const { t, activePart, collection, language, PlayListComponent } = this.props;

    const player = (
      <AVPlaylistPlayerRMP
        language={language}
        collection={collection}
        activePart={activePart}
        onActivePartChange={this.props.onActivePartChange}
        t={t}
      />
    );

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          {player}
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <PlayListComponent
            collection={collection}
            activePart={activePart}
            t={t}
            onItemClick={this.handlePartClick}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default FullVideoBox;
