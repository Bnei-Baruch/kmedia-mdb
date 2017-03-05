import React from 'react';
import ReactDOM from 'react-dom';
import Kmedia from './components/kmedia';
import { BrowserRouter as Router } from 'react-router-dom';

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <Router forceRefresh={!supportsHistory} keyLength={12}>
    <Kmedia />
  </Router>
  , document.getElementById('root')
);
