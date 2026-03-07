const React = require('react');
const { View } = require('react-native');

function Mock(props) {
  return React.createElement(View, props);
}

Mock.glyphMap = {};

module.exports = {
  MaterialIcons: Mock,
};
