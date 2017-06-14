import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import * as shapes from '../shapes';

const AVSwitch = ({ video, audio, active, onChange }) => (
  <Button.Group fluid>
    {video && active === video ? <Button active color="blue">Video</Button> : null }
    {video && active !== video ? <Button onClick={onChange}>Video</Button> : null}
    {!video ? <Button disabled>Video</Button> : null}

    {audio && active === audio ? <Button active color="blue">Audio</Button> : null }
    {audio && active !== audio ? <Button onClick={onChange}>Audio</Button> : null }
    {!audio ? <Button disabled>Audio</Button> : null}
  </Button.Group>
);

AVSwitch.propTypes = {
  video: shapes.MDBFile,
  audio: shapes.MDBFile,
  active: shapes.MDBFile,
  onChange: PropTypes.func.isRequired,
};

AVSwitch.defaultProps = {
  video: null,
  audio: null,
  active: null,
};

export default AVSwitch;
