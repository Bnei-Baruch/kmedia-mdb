import React from 'react';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';

const widthBySize          = {
  'normal': '140px',
};
const UnitLogoWithDuration = ({ duration, size = 'normal', ...propz }) => (
  <div className="with_duration" style={{ minWidth: widthBySize[size] }}>
    {
      duration && (
        <div className="duration">{
          formatDuration(duration, null)
        }
        </div>
      )
    }
    <UnitLogo {...propz} />
  </div>
);

export default UnitLogoWithDuration;
