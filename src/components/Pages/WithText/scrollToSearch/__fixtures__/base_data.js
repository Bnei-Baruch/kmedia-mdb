export const data = (
  `<div>
  <p>
    <strong>Kabbalah and dedicated myself to it</strong>
  </p>
  <p>
    <strong>Before I clarify this exalted matter, it is important for me to note that although all the readers seem</strong>
  </p>
</div>`
);

export const source = '<div>  <p>  <strong>Kabbalah and dedicated myself to it</strong>  </p>  <p>  <strong>Before I clarify this exalted matter, it is important for me to note that although all the readers seem</strong>  </p> </div>';

export const dataCleanHtml = '  Kabbalah and dedicated myself to it   Before I clarify this exalted matter, it is important for me to note that although all the readers seem  ';

export const tagPositions = [
  {
    'noHtmlPos': 0,
    'pos': 0,
    'str': '<div>'
  },
  {
    'noHtmlPos': 2,
    'pos': 7,
    'str': '<p>'
  },
  {
    'noHtmlPos': 4,
    'pos': 12,
    'str': '<strong>'
  },
  {
    'noHtmlPos': 39,
    'pos': 55,
    'str': '</strong>'
  },
  {
    'noHtmlPos': 41,
    'pos': 66,
    'str': '</p>'
  },
  {
    'noHtmlPos': 43,
    'pos': 72,
    'str': '<p>'
  },
  {
    'noHtmlPos': 45,
    'pos': 77,
    'str': '<strong>'
  },
  {
    'noHtmlPos': 148,
    'pos': 188,
    'str': '</strong>'
  },
  {
    'noHtmlPos': 150,
    'pos': 199,
    'str': '</p>'
  },
  {
    'noHtmlPos': 151,
    'pos': 204,
    'str': '</div>'
  }
];

// tagPositions after RenderBase collapses whitespace in the source
export const cleanTagPositions = [
  {
    'noHtmlPos': 0,
    'pos': 0,
    'str': '<div>'
  },
  {
    'noHtmlPos': 1,
    'pos': 6,
    'str': '<p>'
  },
  {
    'noHtmlPos': 2,
    'pos': 10,
    'str': '<strong>'
  },
  {
    'noHtmlPos': 37,
    'pos': 53,
    'str': '</strong>'
  },
  {
    'noHtmlPos': 38,
    'pos': 63,
    'str': '</p>'
  },
  {
    'noHtmlPos': 39,
    'pos': 68,
    'str': '<p>'
  },
  {
    'noHtmlPos': 40,
    'pos': 72,
    'str': '<strong>'
  },
  {
    'noHtmlPos': 143,
    'pos': 183,
    'str': '</strong>'
  },
  {
    'noHtmlPos': 144,
    'pos': 193,
    'str': '</p>'
  },
  {
    'noHtmlPos': 145,
    'pos': 198,
    'str': '</div>'
  }
];
