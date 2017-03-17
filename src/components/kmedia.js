import React  from 'react';

import 'semantic-ui-css/semantic.css';
import '../stylesheets/Kmedia.css';

import Footer from './footer';
import Layout from './layout';
import Content from './content';

const Kmedia = () => (
  <Layout>
    <Content/>
    <Footer/>
  </Layout>
);

export default Kmedia;
