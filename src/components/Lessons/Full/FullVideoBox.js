import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Grid, Header, Menu } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import AVPlaylistPlayerRMP from '../../AVPlayerRMP/AVPlaylistPlayerRMP';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection.isRequired,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
  };

  handleLessonPartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  render() {
    const { t, activePart, fullLesson, language } = this.props;

    const titles = fullLesson.content_units.map((cu) => {
      const { name, duration } = cu;
      const ccuName            = fullLesson.ccuNames[cu.id];
      const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
      return `${ccuName} - ${name} - ${durationDisplay}`;
    });

    const player = (
      <AVPlaylistPlayerRMP
        language={language}
        contentUnits={fullLesson.content_units}
        activePart={activePart}
        onActivePartChange={this.props.onActivePartChange}
        t={t}
      />
    );

    const playList = (
      <div>
        <Header inverted
          as="h3"
          content={`${t(`constants.content-types.${fullLesson.content_type}`)} - ${(activePart + 1)}/${fullLesson.content_units.length}`}
          subheader={t('values.date', { date: new Date(fullLesson.film_date) })}
        />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Menu vertical fluid size="small">
                {
                  fullLesson.content_units.map((part, index) => (
                    <Menu.Item
                      key={part.id}
                      name={`${index}`}
                      content={titles[index]}
                      active={index === activePart}
                      onClick={this.handleLessonPartClick}
                    />
                  ))
                }
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          {player}
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          {playList}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default FullVideoBox;
