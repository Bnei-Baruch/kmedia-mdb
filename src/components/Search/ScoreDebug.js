import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogPanel } from '@headlessui/react';

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
              <span
                className="material-symbols-outlined cursor-pointer text-base"
                onClick={() => {
                  open[key].open = true;
                  this.updateOpen();
                }}
              >
                add
              </span>
            )
            : (
              <span
                className="material-symbols-outlined cursor-pointer text-base"
                onClick={() => {
                  open[key].open = false;
                  this.updateOpen();
                }}
              >
                remove
              </span>
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
        <button
          className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => this.setState({ open: true })}
        >
          <span className="material-symbols-outlined text-base">science</span>
          {score}
        </button>
        {explanation ? null : (
          <span data-tooltip="Explanations are null.">
            <span className="material-symbols-outlined text-yellow-500 text-3xl">warning</span>
          </span>
        )}
        <Dialog open={open} onClose={() => this.setState({ open: false })} className="relative z-50">
          <div className="fixed inset-0 bg-white/75" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto shadow-xl text-left">
              <h2>{name}</h2>
              {this.reduceExplanation(explanation, treeOpen, 0)}
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ScoreDebug;
