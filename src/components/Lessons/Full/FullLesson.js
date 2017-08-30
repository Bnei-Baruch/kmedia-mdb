import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Grid } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';
import FullVideoBox from './FullVideoBox';
import Info from '../Part/Info';
import Materials from '../Part/Materials';
import MediaDownloads from '../Part/MediaDownloads';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullLesson: null,
    wip: false,
    err: null,
  };

  state = {
    activePart: 0,
  };

  handleActivePartChange = activePart =>
    this.setState({ activePart });

  render() {
    const { fullLesson, wip, err, language, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (fullLesson) {
      const { activePart } = this.state;
      const lesson         = fullLesson.content_units[activePart];
      return (
        <Grid.Column width={16}>
          <Grid>
            <FullVideoBox
              fullLesson={fullLesson}
              activePart={activePart}
              onActivePartChange={this.handleActivePartChange}
              language={language}
              t={t}
            />
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <Info lesson={lesson} t={t} />
                <Materials lesson={lesson} t={t} />
              </Grid.Column>
              <Grid.Column width={6}>
                <MediaDownloads lesson={lesson} language={language} t={t} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      );
    }

    return (
      <FrownSplash
        text={t('messages.lesson-not-found')}
        subtext={
          <Trans i18nKey="messages.lesson-not-found-subtext">
            Try the <Link to="/lessons">lessons list</Link>...
          </Trans>
        }
      />
    );
  }
}

export default translate()(FullLesson);
