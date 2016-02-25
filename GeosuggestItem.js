'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var GeosuggestItem = _react2['default'].createClass({
  displayName: 'GeosuggestItem',

  /**
   * Get the default props
   * @return {Object} The props
   */
  getDefaultProps: function getDefaultProps() {
    return {
      isActive: false,
      suggest: {
        label: ''
      },
      onSuggestSelect: function onSuggestSelect() {}
    };
  },

  /**
   * When the element gets clicked
   * @param  {Event} event The click event
   */
  onClick: function onClick(event) {
    event.preventDefault();
    this.props.onSuggestSelect(this.props.suggest);
  },

  /**
   * Render the view
   * @return {Function} The React element to render
   */
  render: function render() {
    var clas = this.getSuggestClasses();
    clas += typeof this.props.suggest.label !== 'string' ? 'invalidate' : '';
    return (// eslint-disable-line no-extra-parens
      _react2['default'].createElement(
        'li',
        { className: clas,
          onClick: this.onClick },
        this.props.suggest.label
      )
    );
  },

  /**
   * The classes for the suggest item
   * @return {String} The classes
   */
  getSuggestClasses: function getSuggestClasses() {
    var className = this.props.suggest.className;
    var classes = 'geosuggest-item';

    classes += this.props.isActive ? ' geosuggest-item--active' : '';
    classes += className ? ' ' + className : '';

    return classes;
  }
});

module.exports = GeosuggestItem;