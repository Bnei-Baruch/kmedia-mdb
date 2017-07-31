import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import * as shapes from '../shapes';

const AVSwitch = (props) => {
  const { video, audio, active, onChange, t } = props;
  return (
    <Button.Group fluid>
      {video && active === video ? <Button active color="blue" content={t('buttons.video')} /> : null }
      {video && active !== video ? <Button content={t('buttons.video')} onClick={onChange} /> : null}
      {!video ? <Button disabled content={t('buttons.video')} /> : null}

      {audio && active === audio ? <Button active color="blue" content={t('buttons.audio')} /> : null }
      {audio && active !== audio ? <Button content={t('buttons.audio')} onClick={onChange} /> : null }
      {!audio ? <Button disabled content={t('buttons.audio')} /> : null}
    </Button.Group>
  );
};

AVSwitch.propTypes = {
  video: shapes.MDBFile,
  audio: shapes.MDBFile,
  active: shapes.MDBFile,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

AVSwitch.defaultProps = {
  video: null,
  audio: null,
  active: null,
};

export default AVSwitch;
