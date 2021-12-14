import { useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { Control } from '@vime/react';


const VmAudioVideo = ({ isVideo, onSwitchAV, t }) => {
  const ref = useRef(null);

  return (
    <Control
      ref={ref}
      style={{ '--vm-control-scale': 0.5, margin: '0 -2.5rem' }}
      // class={'mediaplayer__audiovideo'}
    >
      <button type="button" onClick={onSwitchAV}>
        <span className={!isVideo ? 'is-active' : ''}>{t('buttons.audio')}</span>
        &nbsp;/&nbsp;
        <span className={isVideo ? 'is-active' : ''}>{t('buttons.video')}</span>
      </button>

      {/* <span
        className={classNames({ 'is-active': !isVideo })}
        onClick={() => onSwitchAV('audio')}
      >audio
      </span>
      &nbsp;/&nbsp;
      <span
        className={classNames({ 'is-active': isVideo })}
        onClick={() => onSwitchAV('video')}
      >video
      </span> */}
    </Control>
  );
};

export default withNamespaces()(VmAudioVideo);
