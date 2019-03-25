import React from 'react';

class CustomComponentOne extends React.Component {
	render() {
		return React.createElement(
			"span",
			null,
			"Hello there ",
			this.props.name,
			"!"
		);
	}
}


export default CustomComponentOne;
