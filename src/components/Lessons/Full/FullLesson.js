import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Menu } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

import VideoBox from '../Part/VideoBox';
import PartsList from './PartsList/PartsList';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
  };

  static defaultProps = {
    fullLesson: null
  };

  constructor(props) {
    super(props);
    this.state = this.getState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = (props) => {
    const { fullLesson } = props;
    if (fullLesson && fullLesson.content_units) {
      console.log('KUKU', props.fullLesson.content_units[0].id);
      const activeLesson = props.getUnitById(props.fullLesson.content_units[0].id);
      if (!activeLesson) {
        // TODO: Wrap VideoBox with fetcher by id by demand.
        // Check in the reducers that unit by id is loading to not fetch it many times.
        props.fetchLessonPart(props.fullLesson.content_units[0].id);
        return { activeLesson: null };
      } else {
        return { activeLesson: props.getUnitById(props.fullLesson.content_units[0].id) };
      }
    } else {
      return { activeLesson: null };
    }
  };

  render() {
    const { fullLesson, language } = this.props;

    console.log('Render full lesson:', this.props, this.state, fullLesson, language);

    if (isEmpty(fullLesson)) {
      return <div />;
    }

    // ALL HTML HERE IS COPIED FROM LESSONPART AND SHOULD BE UPDATED.
    // CONTINUE HERE!!!
    return (
      <Grid.Column width={16}>
        <Grid>
          <VideoBox language={language} lesson={this.state.activeLesson || {}} />
        </Grid>
        <Grid>
          <PartsList fullLesson={fullLesson.content_units}  />
        </Grid>
      </Grid.Column>
      // <Grid.Column width={16}>
      //   <Grid>
      //     <VideoBox files={fullLesson.files} language={language} />
      //   </Grid>
      //   <Grid>
      //     <Grid.Row>
      //       <Grid.Column width={10}>
      //         <Header as="h3">
      //           <span className="text grey">{fullLesson.film_date}</span><br />
      //           {fullLesson.name}
      //         </Header>
      //         <List style={{
      //           backgroundColor: 'gray',
      //           backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
      //         }}
      //         >
      //           <List.Item><b>Topics:</b> <a href="">From Lo Lishma to Lishma</a>, <a href="">Work in
      //             group</a></List.Item>
      //           <List.Item><b>Sources:</b> <a href=""> Shamati - There is None Else Beside Him</a>, <a href="">Shamati -
      //             Divinity in Exile</a></List.Item>
      //           <List.Item><b>Related to Event:</b> <a href="">World Israel Congress 2016</a></List.Item>
      //         </List>
      //         <Menu
      //           secondary
      //           pointing
      //           color="blue"
      //           className="index-filters"
      //           style={{
      //             backgroundColor: 'gray',
      //             backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
      //           }}
      //         >
      //           <Menu.Item name="item-summary">Summary</Menu.Item>
      //           <Menu.Item name="item-transcription">Transcription</Menu.Item>
      //           <Menu.Item name="item-sources">Sources</Menu.Item>
      //           <Menu.Item name="item-sketches">Sketches</Menu.Item>
      //         </Menu>
      //       </Grid.Column>
      //       <Grid.Column width={6}>
      //         <MediaDownloads files={fullLesson.files} language={language} />
      //       </Grid.Column>
      //     </Grid.Row>
      //   </Grid>
      // </Grid.Column>
    );
  }
};

export default FullLesson;
