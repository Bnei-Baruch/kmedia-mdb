import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

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
    error: shapes.Error,
  };

  static defaultProps = {
    fullLesson: null,
    wip: false,
    error: null,
  };

  state = {
    activePart: 0,
  };

  handleActivePartChange = (activePart) =>
    this.setState({ activePart });

  render() {
    const { fullLesson, wip, err, language } = this.props;

    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text="Loading" subtext="Hold on tight..." />;
    }

    if (fullLesson) {
      const { activePart } = this.state;
      const lesson         = fullLesson.content_units[activePart];
      return (
        <Grid.Column width={16}>
          <Grid>
            <FullVideoBox
              fullLesson={fullLesson}
              language={language}
              activePart={activePart}
              onActivePartChange={this.handleActivePartChange}
            />
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <Info lesson={lesson} />
                <Materials lesson={lesson} />
              </Grid.Column>
              <Grid.Column width={6}>
                <MediaDownloads lesson={lesson} language={language} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      );
    }

    return (
      <FrownSplash
        text="Couldn't find lesson"
        subtext={<span>Try the <Link to="/lessons">lessons list</Link>...</span>}
      />
    );
  }
}

export default FullLesson;
