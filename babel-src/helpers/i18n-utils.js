'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getCurrentDirection = exports.getCurrentDirection = function getCurrentDirection() {
  return document.getElementById('root').style.getPropertyValue('direction');
};

var changeDirection = exports.changeDirection = function changeDirection(direction) {
  if (typeof window === 'undefined') {
    return;
  }

  var isRTL = direction === 'rtl';

  // replace semantic-ui css
  var oldlink = document.getElementById('semantic-ui');
  var newlink = document.createElement('link');
  newlink.setAttribute('rel', 'stylesheet');
  newlink.setAttribute('type', 'text/css');
  newlink.setAttribute('id', 'semantic-ui');
  newlink.setAttribute('href', '/semantic' + (isRTL ? '.rtl' : '') + '.min.css');
  document.getElementsByTagName('head').item(0).replaceChild(newlink, oldlink);

  // change root element direction
  var root = document.getElementById('root');
  root.setAttribute('style', 'direction: ' + direction + ';');
  if (isRTL) {
    root.classList.add('rtl');
  } else {
    root.classList.remove('rtl');
  }
};