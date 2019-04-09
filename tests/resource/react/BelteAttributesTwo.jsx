import ReactDOM from 'react-dom';
import React from 'react';

class Component extends React.Component {
  render() {
    return (
      <div>
        <p>Age: {this.props.age} at a whopping {this.props.height}{this.props.unit}</p>
      </div>
    );
  }
}
export default Component;

