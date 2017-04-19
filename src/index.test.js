import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Kmedia from './components/kmedia';

const supportsHistory = 'pushState' in window.history;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router forceRefresh={!supportsHistory} keyLength={12}>
      <Kmedia />
    </Router>,
    div);
});

