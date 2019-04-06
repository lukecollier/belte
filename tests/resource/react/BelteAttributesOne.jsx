import React from 'react';

class Component extends React.Component {
  render() {
    return (
      <div>
        <h1>Name: { this.props.first } {this.props.second}</h1>
      </div>
    );
  }
}
export default Component;

