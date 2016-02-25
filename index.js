/* global google */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Geosuggest = require('./Geosuggest');

var _Geosuggest2 = _interopRequireDefault(_Geosuggest);

// eslint-disable-line

var App = _react2['default'].createClass({
  displayName: 'App',
  // eslint-disable-line
  /**
   * Render the example app
   * @return {Function} React render function
   */
  render: function render() {
    var fixtures = [{ label: 'New York', location: { lat: 40.7033127, lng: -73.979681 } }, { label: 'Rio', location: { lat: -22.066452, lng: -42.9232368 } }, { label: 'Tokyo', location: { lat: 35.673343, lng: 139.710388 } }];

    return (// eslint-disable-line
      _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(_Geosuggest2['default'], {
          fixtures: fixtures,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onChange: this.onChange,
          onSuggestSelect: this.onSuggestSelect,
          location: new google.maps.LatLng(53.558572, 9.9278215),
          radius: '20' })
      )
    );
  },

  /**
   * When the input receives focus
   */
  onFocus: function onFocus() {
    console.log('onFocus'); // eslint-disable-line
  },

  /**
   * When the input loses focus
   */
  onBlur: function onBlur() {
    console.log('onBlur'); // eslint-disable-line
  },

  onChange: function onChange(value) {
    console.log('input changes to :' + value); // eslint-disable-line
  },

  /**
   * When a suggest got selected
   * @param  {Object} suggest The suggest
   */
  onSuggestSelect: function onSuggestSelect(suggest) {
    console.log(suggest); // eslint-disable-line
  }
});

module.exports = App;