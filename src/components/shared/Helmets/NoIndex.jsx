import { Helmet } from './helmetESM';

const NoIndex = () => (
  <Helmet>
    <meta property="robots" content="noindex" />
  </Helmet>
);

export default NoIndex;
