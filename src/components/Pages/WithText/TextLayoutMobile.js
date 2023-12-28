import React from 'react';
import { Container } from 'semantic-ui-react';
import { useTextSubject } from './hooks/useTextSubject';
import { useTextContent } from './Content/useTextContent';
import { useInitTextUrl } from './hooks/useInitTextUrl';
import TextContentMobile from './Content/TextContentMobile';
import { useInitTextSettings } from './hooks/useInitTextSettings';

const TextLayoutMobile = ({ toolbar = null, toc = null, nextPrev: prevNext = null, propId }) => {
  useInitTextUrl();
  useTextSubject(propId);
  useInitTextSettings();

  const wipErr = useTextContent();
  if (wipErr) return wipErr;

  return (
    <Container fluid className="is-mobile text_layout">
      <Container className="padded">
        <TextContentMobile />
        {prevNext}
      </Container>
      {toc}
      <div className="stick_toolbar no_print">
        {toolbar}
      </div>
    </Container>
  );
};

export default TextLayoutMobile;
