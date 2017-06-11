import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Table } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

import * as shapes from '../shapes';
import { MT_AUDIO, MT_IMAGE, MT_TEXT, MT_VIDEO } from '../../helpers/consts';
import LanguageSelector from '../shared/LanguageSelector';

const MEDIA_ORDER = [
  { type: MT_VIDEO, label: 'Lesson Video' },
  { type: MT_AUDIO, label: 'Lesson Audio' },
  { type: MT_TEXT, label: 'Transcription Text' },
  { type: MT_IMAGE, label: 'Sketches' },
];

class MediaDownloads extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(shapes.MDBFile),
  };

  static defaultProps = {
    files: [],
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const groups = this.getFilesByLanguage(props.files);

    let language = props.language;
    if (!groups.has(language)) {
      language = groups.keys().next().value;
    }

    return { groups, language };
  };

  componentWillReceiveProps(nextProps) {
    const { files, language } = nextProps;
    const props               = this.props;
    const state               = this.state;

    // no change
    if (files === props.files && language === props.language) {
      return;
    }

    // only language changed
    if (files === props.files && language !== props.language) {
      if (state.groups.has(language)) {
        this.setState({ language });
        return;
      }
    }

    // files changed, maybe language as well
    const groups = this.getFilesByLanguage(files);
    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    this.setState({
      groups,
      language: lang,
    });
  }

  getFilesByLanguage = (files) => {
    const groups = new Map();

    (files || []).forEach((file) => {
      if (!groups.has(file.language)) {
        groups.set(file.language, new Map());
      }

      const byType = groups.get(file.language);
      if (!byType.has(file.type)) {
        byType.set(file.type, []);
      }
      byType.get(file.type).push(file);
    });

    // sort file lists by size
    groups.forEach(byType => byType.forEach(v => v.sort((a, b) => a.size - b.size)));

    return groups;
  };

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  render() {
    const { language, groups } = this.state;
    const byType               = groups.get(language) || new Map();

    let rows;
    if (byType.size === 0) {
      rows = [<Table.Row key="0"><Table.Cell>No Files</Table.Cell></Table.Row>];
    } else {
      rows = MEDIA_ORDER.reduce((acc, val) => {
        const { type, label } = val;
        const items           = byType.get(type) || [];

        const files = items.map((file) => {
          const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
          const url = `http://cdn.kabbalahmedia.info/${file.id}`;
          return (
            <Table.Row key={file.id} verticalAlign="top">
              <Table.Cell>
                {label}
              </Table.Cell>
              <Table.Cell collapsing>
                <Button as="a" href={url} size="mini" color="orange" compact fluid>
                  {ext.toUpperCase()}
                </Button>
              </Table.Cell>
              <Table.Cell collapsing>
                <CopyToClipboard text={url}>
                  <Button size="mini" color="orange" compact fluid>
                    Copy Link
                  </Button>
                </CopyToClipboard>
              </Table.Cell>
            </Table.Row>
          );
        });

        return acc.concat(files);
      }, []);
    }

    return (
      <div>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3">Media Downloads</Header>
            </Grid.Column>
            <Grid.Column>
              <LanguageSelector
                languages={Array.from(groups.keys())}
                defaultValue={language}
                onSelect={this.handleChangeLanguage}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very" compact="very">
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default MediaDownloads;
