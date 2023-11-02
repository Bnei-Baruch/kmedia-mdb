import React from 'react';
import { Card, Container, Divider, Grid } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, DEFAULT_CONTENT_LANGUAGE } from '../../../src/helpers/consts';
import { assetUrl } from '../../../src/helpers/Api';
import SectionHeader from '../../../src/components/shared/SectionHeader';
import { wrapper } from '../../../lib/redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { clips, texts, fixLang } from './helper';

const HelpPage = async ({ lng }) => {
  const uiLang = fixLang(lng);

  let c    = clips;
  let txts = texts;
  if (uiLang !== LANG_HEBREW) {
    c = [...clips];
    c.splice(4, 1); // remove 4-2 in other langs
    txts = [...texts];
    txts.splice(4, 1); // remove 4-2 in other langs
  }

  return (
    <div>
      <SectionHeader section="help" />
      <Divider hidden />
      <Container>
        <Grid stackable columns={3}>
          {
            c.map((x, i) => (
              <Grid.Column key={x}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{txts[i].title[uiLang]}</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <div>
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        type="video/mp4"
                        src={assetUrl(`help/${uiLang}/clip${x}.mp4`)}
                        poster={assetUrl(`help/${uiLang}/clip${x}.jpg`)}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                  </Card.Content>
                  <Card.Content>
                    {txts[i].description[uiLang]}
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          }
        </Grid>
      </Container>
      <Divider hidden />
    </div>
  );
};

export default HelpPage;
