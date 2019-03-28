const React = require('react');

function CustomComponentOne(props) {
		return React.createElement(
			"span",
			null,
			"Hello there ",
			props.name,
			"!"
		);
}

CustomComponentOne.defaultProps = {
  name: "Garry"
}

module.exports = CustomComponentOne;
