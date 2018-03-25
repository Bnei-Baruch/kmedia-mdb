import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Icon } from 'semantic-ui-react';

class ScoreDebug extends Component {
  static propTypes = {
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      explanation: PropTypes.object.isRequired,
    };

  state = {
    open: false,
    treeOpen: {},
  }

  updateOpen = () => {
    const { treeOpen } = this.state;
    this.setState({treeOpen});
  }

  reduceExplanation = (exp, open, key) => {
    if (!open || !(key in open)) {
      open[key] = {
        open: true,
        details: {},
      };
    }
    return (
      <div key={key}>
        {!exp.details ? <span style={{paddingLeft: '17px'}}></span> :
          (!open[key].open ?
           <Icon name='plus' onClick={() => { open[key].open = true; this.updateOpen(); }} /> :
           <Icon name='minus' onClick={() => { open[key].open = false; this.updateOpen(); }} />)}
        <span>{exp.value} = {exp.description}</span>
        {!exp.details || !open[key].open ? null :
          <div style={{paddingLeft: '25px'}}>{exp.details.map((d, i) => this.reduceExplanation(d, open[key].details, i))}</div>}
      </div>
    );
  }

  render() {
      const { name, score, explanation } = this.props;
      const { open, treeOpen } = this.state;

      return (
            <div>
              <Button color='red' icon='flask' content={score} onClick={() => this.setState({open: true})}/>
              <Modal dimmer='inverted' open={open} onClose={() => this.setState({open: false})}>
                <Modal.Content style={{textAlign: 'left'}}>
                  <h2>{name}</h2>
                  {this.reduceExplanation(explanation, treeOpen, 0)}
                </Modal.Content>
              </Modal>
            </div>
          );
    }
}

export default ScoreDebug;
