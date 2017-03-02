import React from 'react';
import ReactDOM from 'react-dom';
import Kmedia from './Kmedia';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <Router
    forceRefresh={!supportsHistory}
    keyLength={12}
  >
    <Kmedia />
  </Router>
  , document.getElementById('root')
);
