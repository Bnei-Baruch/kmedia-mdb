import { useRef } from 'react';
import { Control } from '@vime/react';
import { Icon as Icon } from 'semantic-ui-react';

export const VmPrevNext = ({ isPrev, isDisabled, onClick }) => {
  const ref  = useRef(null);
  const icon = isPrev ? 'step backward' : 'step forward';

  return (
    <Control
      ref={ref}
      onClick={onClick}
      disabled={isDisabled}
      style={{ '--vm-control-scale': 0.5 }}
    >
      <Icon name={icon} disabled={isDisabled} />
    </Control>
  );
};
