import { Button, Header, Icon, Menu } from 'semantic-ui-react';
import React from 'react';

const Settings = () => {
  return (

    <div className="settings">
      <div className="settings__pane">
        <div className="settings__row">
          <Header size="tiny">Playback</Header>
          <Button.Group size="mini" inverted>
            <Button active inverted>Video</Button>
            <Button inverted>Audio</Button>
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Playback speed</Header>
          <Button.Group size="mini" inverted>
            <Button inverted>0.75x</Button>
            <Button active inverted>normal</Button>
            <Button inverted>1.25x</Button>
            <Button inverted>1.5x</Button>
            <Button inverted>2x</Button>
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Quality</Header>
          <Button.Group size="mini" inverted>
            <Button active inverted>360p</Button>
            <Button inverted>720p</Button>
            <Button inverted>1080p</Button>
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Language</Header>
          <Button.Group size="mini" inverted>
            <Button inverted>
              English
              <Icon name="right chevron" />
            </Button>
          </Button.Group>
        </div>
      </div>
      <div className="settings__pane">
        <Button inverted fluid><Icon name="left chevron" />
          Language
        </Button>
        <Menu secondary vertical inverted size="small">
          <Menu.Item link active name="עברית"></Menu.Item>
          <Menu.Item link name="English"></Menu.Item>
          <Menu.Item link>Русский</Menu.Item>
          <Menu.Item link>Español</Menu.Item>
          <Menu.Item link>Italiano</Menu.Item>
          <Menu.Item link>Deutsch</Menu.Item>
          <Menu.Item link>Français</Menu.Item>
          <Menu.Item link>Português</Menu.Item>
          <Menu.Item link>Türkçe</Menu.Item>
          <Menu.Item link>Magyar</Menu.Item>
          <Menu.Item link>Lietuvių</Menu.Item>
          <Menu.Item link>Български</Menu.Item>
          <Menu.Item link>中文</Menu.Item>
          <Menu.Item link>Românește</Menu.Item>
          <Menu.Item link>Українська</Menu.Item>
          <Menu.Item link>Slovenščina</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Settings;
