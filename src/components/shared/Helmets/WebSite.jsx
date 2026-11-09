import JsonLd from './JsonLd';
import { absoluteUrl, bcp47, SITE_NAME, SITE_URL } from '../../../helpers/seo';
import { publicFile } from '../../../helpers/utils';

/**
 * WebSite (+ sitelinks search box) and Organization structured data.
 * Google reads these from the home page only.
 */
const WebSite = ({ uiLang, description }) => (
  <JsonLd
    id="website"
    data={{
      '@graph': [
        {
          '@type'        : 'Organization',
          '@id'          : `${SITE_URL}#organization`,
          name           : SITE_NAME,
          url            : SITE_URL,
          logo           : publicFile('seo/default.png'),
        },
        {
          '@type'        : 'WebSite',
          '@id'          : `${SITE_URL}#website`,
          name           : SITE_NAME,
          url            : absoluteUrl(uiLang),
          description,
          inLanguage     : bcp47(uiLang),
          publisher      : { '@id': `${SITE_URL}#organization` },
          potentialAction: {
            '@type'      : 'SearchAction',
            target       : { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl(uiLang, 'search')}?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    }}
  />
);

export default WebSite;
