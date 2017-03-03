import React  from 'react';

import 'semantic-ui-css/semantic.css';
import '../stylesheets/Kmedia.css';

import Footer from './Footer'
import SidebarLeftPush from './SidebarLeftPush';
import Content from './content';

const Kmedia = () => (
  <SidebarLeftPush>
    <Content/>
    <Footer/>
  </SidebarLeftPush>
);

export default Kmedia;

