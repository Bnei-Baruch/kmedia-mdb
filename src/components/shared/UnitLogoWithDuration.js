import React from 'react';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';

const UnitLogoWithDuration = ({ duration, ...propz }) => (
  <div className="with_duration" style={{ minWidth: propz.width }}>
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
