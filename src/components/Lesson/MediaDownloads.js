import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Table } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { ALL_LANGUAGES } from '../../helpers/consts';
import LanguageSelector from '../shared/LanguageSelector';

const fileTypeDisplay = (type) => {
  switch (type) {
  case 'audio':
  case 'video':
    return type.toUpperCase();
  case 'source':
  case 'text':
    return 'DOC';
  case 'sketches':
    return 'ZIP';
  default:
    return 'UNK';
  }
};

const MediaDownloads = ({ files }) => (
  <div>
    <Grid columns="equal">
      <Grid.Row>
        <Grid.Column>
          <Header as="h3">Media Downloads</Header>
        </Grid.Column>
        <Grid.Column>
          <LanguageSelector languages={ALL_LANGUAGES} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Table basic="very" compact="very">
      <Table.Body>
        {
          files.length === 0 ?
            <Table.Row>
              <Table.Cell>
                No Files
              </Table.Cell>
            </Table.Row> :
            files.map(file =>
              (<Table.Row key={file.id}>
                <Table.Cell>Lesson Audio</Table.Cell>
                <Table.Cell collapsing>
                  <Button size="mini" color="orange" compact fluid>
                    {fileTypeDisplay(file.type)}
                  </Button>
                </Table.Cell>
                <Table.Cell collapsing>
                  <Button size="mini" color="orange" compact fluid>
                    Copy Link
                  </Button>
                </Table.Cell>
              </Table.Row>)
            )
        }
      </Table.Body>
    </Table>
  </div>
);

MediaDownloads.propTypes = {
  files: PropTypes.arrayOf(shapes.MDBFile),
};

MediaDownloads.defaultProps = {
  files: [],
};

export default MediaDownloads;
