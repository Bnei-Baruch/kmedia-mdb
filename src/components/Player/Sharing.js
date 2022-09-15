import { Input, Button, Popup } from 'semantic-ui-react';
import React from 'react';

const Settings = () => {
  return (
    <div className="sharing">
      <div className="sharing__times">
        <div className="sharing__inputs">
          <Input size="mini" actionPosition="left"
                 action={{
                   content: 'start time',
                   size: 'small',
                   compact: true
                 }}
                 placeholder="Click to set" />
          <Input size="mini" actionPosition="left"
                 action={{
                   content: 'end time',
                   size: 'small',
                   compact: true
                 }}
                 placeholder="Click to set" />
        </div>
        <div className="sharing__reset">
          <Button size="small">Reset to full video</Button>
        </div>
      </div>
      <div className="sharing__buttons">
        <Input size="mini" fluid
               action={{
                 content: 'copy',
                 size: 'small',
                 compact: true
               }}
               value="https://kabbalahmedia.info/lessons/cu/5HxoTWsG?sstart=44s&send=11m28s&mediaType=video&shareLang=en"
        />
        <Popup content="Facebook" inverted size="mini" position="top center" trigger={
          <Button circular color="facebook" icon="facebook" />
        } />
        <Popup content="Twitter" inverted size="mini" position="top center" trigger={
          <Button circular color="twitter" icon="twitter" />
        } />
        <Popup content="Whatsapp" inverted size="mini" position="top center" trigger={
          <Button circular color="whatsapp" icon="whatsapp" />
        } />
        <Popup content="Telegram" inverted size="mini" position="top center" trigger={
          <Button circular color="telegram" icon="telegram" />
        } />
        <Popup content="Odnoklassniki" inverted size="mini" position="top center" trigger={
          <Button circular color="odnoklassniki" icon="odnoklassniki" />
        } />
        <Popup content="Email" inverted size="mini" position="top center" trigger={
          <Button circular icon="mail" />
        } />
        <Popup content="Download file" inverted size="mini" position="top center" trigger={
          <Button circular icon="download" />
        } />
        <Popup content="Embed media" inverted size="mini" position="top center" trigger={
          <Button circular icon="code" />
        } />
      </div>
    </div>
  );
};

export default Settings;
