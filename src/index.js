import React from 'react';
import { render } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Kmedia from './components/kmedia';

render(<Kmedia />, document.getElementById('root'));
registerServiceWorker();
