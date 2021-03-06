import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';

class ScoreDebug extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    score: PropTypes.number.isRequired,
    explanation: PropTypes.shape({}),
  };

  static defaultProps = {
    explanation: null,
  };

  state = {
    open: false,
    treeOpen: {},
  };

  updateOpen = () => {
    const { treeOpen } = this.state;
    this.setState({ treeOpen });
  };

  reduceExplanation = (exp, open, key) => {
    if (!exp) {
      return (<div>Error, expected explanations, got null.</div>);
    }

    if (!open || !(key in open)) {
      open[key] = {
        open: true,
        details: {},
      };
    }

    return (
      <div key={key}>
        {!exp.details
          ? <span style={{ paddingLeft: '17px' }} />
          : (!open[key].open
            ? (
              <Icon
                name="plus"
                onClick={() => {
                  open[key].open = true;
                  this.updateOpen();
                }}
              />
            )
            : (
              <Icon
                name="minus"
                onClick={() => {
                  open[key].open = false;
                  this.updateOpen();
                }}
              />
            ))
        }
        <span>
          {exp.value}
          {' '}
=
          {' '}
          {exp.description}
        </span>
        {
          !exp.details || !open[key].open
            ? null
            : (
              <div style={{ paddingLeft: '25px' }}>
                {exp.details.map((d, i) => this.reduceExplanation(d, open[key].details, i))}
              </div>
            )
        }
      </div>
    );
  };

  render() {
    const { name, score, explanation } = this.props;
    const { open, treeOpen }           = this.state;

    return (
      <div className="score_debug">
        <Button color="red" icon="flask" content={score} onClick={() => this.setState({ open: true })} />
        {explanation ? null : (
          <span data-tooltip="Explanations are null."><Icon name="warning sign" color="yellow" size="big" /></span>
        )}
        <Modal dimmer="inverted" open={open} onClose={() => this.setState({ open: false })}>
          <Modal.Content style={{ textAlign: 'left' }}>
            <h2>{name}</h2>
            {this.reduceExplanation(explanation, treeOpen, 0)}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ScoreDebug;
