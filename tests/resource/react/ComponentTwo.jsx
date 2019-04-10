import React from 'react';
import Component from './Component.jsx';

class ComponentTwo extends React.Component {
  render() {
    return (
      <div>
        <Component name={this.props.name}/>
      </div>
    );
  }
}
export default ComponentTwo;

