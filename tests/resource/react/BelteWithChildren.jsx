import ReactDOM from 'react-dom';
import React from 'react';
import BelteSingular from './BelteSingular.jsx';

class Component extends React.Component {
  render() {
    return (
      <div>
        <BelteSingular/>
        Hello Belte, I am number two!
      </div>
    );
  }
}
export default Component;

