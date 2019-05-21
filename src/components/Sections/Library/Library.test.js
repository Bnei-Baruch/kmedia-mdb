import React from 'react';

import { mountWrapRouter } from '../../../setupTests';
import Library from './Library';

const commonProps = {
  language: 'he',
  isTaas: false,
  handleLanguageChanged: () => (0),
  startsFrom: 1,
  withRef: true,
  t: x => (x),
};

// console.log(library.debug());

describe('Library', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="pdfWrapper" />';
  });

  it('renders PDF file if "isTaas & pdfFile"', () => {
    const props   = {
      ...commonProps,
      isTaas: true,
      pdfFile: 'o5lXptLo/heb_tes_kerech-2_helek-5.pdf',
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library).toContainExactlyOneMatchingElement('#pdfWrapper');
  });

  it('renders Segment if content is empty', () => {
    const props   = {
      ...commonProps,
      content: {},
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library.exists()).toBe(true);
    expect(library).toContainExactlyOneMatchingElement('.ui.basic.segment');
  });

  it('renders FrownSplash if content.err and err.response.status === 404', () => {
    const props   = {
      ...commonProps,
      content: {
        err: {
          response: {
            status: 404,
          }
        }
      },
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library).toContainExactlyOneMatchingElement('[text="messages.source-content-not-found"] [icon="frown"]');
  });

  it('renders ErrorSplash if content.err and err.response.status !== 404', () => {
    const props   = {
      ...commonProps,
      content: {
        err: {
          response: {
            status: 500,
            statusText: 'Unexpected error',
            data: {
              error: 500,
            }
          }
        }
      },
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library.exists()).toBe(true);
    expect(library.find('[text="messages.server-error"]').find('[subtext="Unexpected error: 500"]').exists('[icon="warning sign"]')).toBe(true);
  });

  it('renders LoadingSplash if content.wip', () => {
    const props   = {
      ...commonProps,
      content: {
        wip: true,
      },
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library.exists()).toBe(true);
    expect(library.find('[text="messages.loading"]').find('[subtext="messages.loading-subtext"]').exists('[icon="circle notch"]')).toBe(true);
  });

  it('renders sources-library.no-source if !content.data is blank and !"isTaas & pdfFile"', () => {
    const props   = {
      ...commonProps,
      content: {
        data: undefined,
      },
      isTaas: false,
      pdfFile: undefined,
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library.exists()).toBe(true);
    expect(library.find('.ui.basic.segment')).toHaveText('sources-library.no-source');
  });

  it('renders content.data if !"isTaas & pdfFile"', () => {
    const props   = {
      ...commonProps,
      content: {
        data: 'TALMUD ESER SEFIROT',
      },
      isTaas: false,
      pdfFile: undefined,
    };
    const library = mountWrapRouter(<Library {...props} />);
    expect(library.exists()).toBe(true);
    expect(library.find('div[dangerouslySetInnerHTML]')).toHaveText('TALMUD ESER SEFIROT');
  });
});
