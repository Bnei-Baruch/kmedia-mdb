module.exports = {
  multipass: true,
  plugins: [
    'preset-default',
    { name: 'removeStyleElement' },
    { name: 'removeScriptElement' },
    { name: 'convertStyleToAttrs' },
    { name: 'inlineStyles', params: { onlyMatchedOnce: false } },
    { name: 'removeAttrs', params: { attrs: '(class|style|data-.*)' } },
    { name: 'convertShapeToPath' },
    { name: 'removeDimensions' },
    { name: 'removeViewBox', active: false }
  ]
};