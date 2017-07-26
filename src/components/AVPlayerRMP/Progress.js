import React, { Component } from 'react';

class Progress extends Component {

  render() {
    const parent = {
      display: 'flex',
      flexWrap: 'nowrap',
    };
    const styleBar = {
      height: 3,
    };
    const stylePlayed = {
      width: 45,
      backgroundColor: 'rgb(66, 133, 244)',
      marginLeft: 10,
      marginRight: 0,
      ...styleBar,
    };
    const styleLoaded = {
      width: 15,
      backgroundColor: 'rgb(214, 214, 214)',
      marginLeft: 0,
      marginRight: 0,
      ...styleBar,
    };
    const styleLeft = {
      width: 30,
      backgroundColor: 'rgb(118, 118, 118)',
      marginLeft: 0,
      marginRight: 10,
      ...styleBar,
    }
    return (<div style={parent}>
              <div style={stylePlayed}></div>
              <div style={styleLoaded}></div>
              <div style={styleLeft}></div>
            </div>);
  }
}
export default Progress;
