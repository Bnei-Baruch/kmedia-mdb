import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import Helmets from '../../../../../shared/Helmets/index';
import WipErr from '../../../../../shared/WipErr/WipErr';

export class BlogPostPage extends Component {
  static propTypes = {
    post: shapes.BlogPost,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    post: null,
    wip: false,
    err: null,
  };

  render() {
    const { post, wip, err, t, language } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!post) {
      return null;
    }

    const { url, title, content, created_at: ts } = post;
    const mts                                     = moment(ts);
    const pHtml = content.replace(/href="\/publications\/blog\//gi, `href="/${language}/publications/blog/`);

    return (
      <div className="blog-post">
        <Helmets.NoIndex />
        <div className="section-header">
          <Container className="padded">
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h1">
                    <Header.Content>
                      <div dangerouslySetInnerHTML={{ __html: title }} />
                    </Header.Content>
                  </Header>
                  <Header as="h4" color="grey">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mts.format('lll')}
                    </a>
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={8} className="post">
                <div className="entry" dangerouslySetInnerHTML={{ __html: pHtml }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withNamespaces()(BlogPostPage);
