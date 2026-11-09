import { Helmet } from './helmetESM';

const NoIndex = () => (
  <Helmet>
    <meta name="robots" content="noindex" />
  </Helmet>
);

export default NoIndex;
