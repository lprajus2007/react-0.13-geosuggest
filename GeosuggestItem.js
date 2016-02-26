'use strict';

var _temporalUndefined = {};

var GeosuggestItem = _temporalUndefined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + ' is not defined - temporal dead zone'); } return true; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

GeosuggestItem = _react2['default'].createClass({
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
    var clas = _temporalUndefined;
    clas = this.getSuggestClasses();

    _temporalAssertDefined(_temporalAssertDefined(clas, 'clas', _temporalUndefined) && clas, 'clas', _temporalUndefined);

    clas += typeof this.props.suggest.label !== 'string' ? 'invalidate' : '';

    return (// eslint-disable-line no-extra-parens
      _react2['default'].createElement(
        'li',
        { className: _temporalAssertDefined(clas, 'clas', _temporalUndefined) && clas,
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
    var className = _temporalUndefined;
    var classes = _temporalUndefined;

    className = this.props.suggest.className;
    classes = 'geosuggest-item';

    _temporalAssertDefined(_temporalAssertDefined(classes, 'classes', _temporalUndefined) && classes, 'classes', _temporalUndefined);

    classes += this.props.isActive ? ' geosuggest-item--active' : '';

    _temporalAssertDefined(_temporalAssertDefined(classes, 'classes', _temporalUndefined) && classes, 'classes', _temporalUndefined);

    classes += _temporalAssertDefined(_temporalAssertDefined(className, 'className', _temporalUndefined) && className, 'className', _temporalUndefined) && _temporalAssertDefined(className, 'className', _temporalUndefined) && className ? ' ' + (_temporalAssertDefined(_temporalAssertDefined(className, 'className', _temporalUndefined) && className, 'className', _temporalUndefined) && _temporalAssertDefined(className, 'className', _temporalUndefined) && className) : '';

    return _temporalAssertDefined(classes, 'classes', _temporalUndefined) && classes;
  }
});
module.exports = _temporalAssertDefined(GeosuggestItem, 'GeosuggestItem', _temporalUndefined) && GeosuggestItem;