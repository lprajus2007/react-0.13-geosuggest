/* global google */

'use strict';

var _temporalUndefined = {};
// eslint-disable-line

var Geosuggest = _temporalUndefined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + ' is not defined - temporal dead zone'); } return true; }

var _react = require('react');

var fuzzysearch = require('fuzzysearch');

var _react2 = _interopRequireDefault(_react);

var _GeosuggestItem = require('./GeosuggestItem');

var _GeosuggestItem2 = _interopRequireDefault(_GeosuggestItem);

Geosuggest = _react2['default'].createClass({
  displayName: 'Geosuggest',

  /**
   * Get the default props
   * @return {Object} The state
   */
  getDefaultProps: function getDefaultProps() {
    var canIUseGoogle = (typeof google !== 'undefined' && typeof google.maps !== 'undefined');
    return {
      fixtures: [],
      initialValue: '',
      placeholder: 'Search places',
      disabled: false,
      className: '',
      location: null,
      radius: 0,
      bounds: null,
      country: null,
      types: null,
      customLocations: null,
      googleMaps: canIUseGoogle ? (google && google.maps) : null,
      onSuggestSelect: function onSuggestSelect() {},
      onFocus: function onFocus() {},
      onBlur: function onBlur() {},
      onChange: function onChange() {},
      skipSuggest: function skipSuggest() {},
      getSuggestLabel: function getSuggestLabel(suggest) {
        return suggest.description;
      }
    };
  },

  /**
   * Get the initial state
   * @return {Object} The state
   */
  getInitialState: function getInitialState() {
    return {
      isSuggestsHidden: true,
      userInput: this.props.initialValue,
      activeSuggest: null,
      suggests: [],
      geocoder: this.props.googleMaps ? new this.props.googleMaps.Geocoder() : null,
      autocompleteService: this.props.googleMaps ? new this.props.googleMaps.places.AutocompleteService() : null
    };
  },

  /**
   * Change inputValue if prop changes
   * @param {Object} props The new props
   */
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.props.initialValue !== props.initialValue) {
      this.setState({ userInput: props.initialValue });
    }
  },

  /**
   * When the input got changed
   */
  onInputChange: function onInputChange() {
    var userInput = this.refs.geosuggestInput.getDOMNode().value;

    this.setState({ userInput: userInput }, (function () {
      this.showSuggests();
      this.props.onChange(userInput);
    }).bind(this));
  },

  /**
   * When the input gets focused
   */
  onFocus: function onFocus() {
    this.props.onFocus();
    this.showSuggests();
  },

  /**
   * Update the value of the user input
   * @param {String} value the new value of the user input
   */
  update: function update(value) {
    this.setState({ userInput: value });
    this.props.onChange(value);
  },

  /*
   * Clear the input and close the suggestion pane
   */
  clear: function clear() {
    this.setState({ userInput: '' }, (function () {
      this.hideSuggests();
    }).bind(this));
  },

  /**
   * Search for new suggests
   */
  searchSuggests: function searchSuggests() {
    if (!this.state.userInput) {
      this.updateSuggests();
      return;
    }
    var customSuggests = this.searchCustomSuggests();

    var options = {
      input: this.state.userInput,
      location: this.props.location || new this.props.googleMaps.LatLng(0, 0),
      radius: this.props.radius
    };

    if (this.props.bounds) {
      options.bounds = this.props.bounds;
    }

    if (this.props.types) {
      options.types = this.props.types;
    }

    if (this.props.country) {
      options.componentRestrictions = {
        country: this.props.country
      };
    }

    this.state.autocompleteService.getPlacePredictions(options, (function (suggestsGoogle) {
      this.updateSuggests(suggestsGoogle, customSuggests);
    }).bind(this));
  },

  searchCustomSuggests: function searchCustomSuggests() {
    var customSuggests = [];
    if (this.props.customLocations && this.state.userInput.length > 3) {
      if (fuzzysearch(this.state.userInput, this.props.customLocations)) {
        customSuggests.push({key: key, data: this.props.customLocations[key]});
      }
      // for(var key in this.props.customLocations){
      //   if (key.toLowerCase().indexOf(this.state.userInput.toLowerCase()) > -1) {
      //     customSuggests.push({key: key, data: this.props.customLocations[key]});
      //   }
      // }
    }
    
    return customSuggests;
  },

  /**
   * Update the suggests
   * @param  {Object} suggestsGoogle The new google suggests
   */
  updateSuggests: function updateSuggests(suggestsGoogle, customSuggests) {
    var _this = this;

    if (!suggestsGoogle) {
      suggestsGoogle = [];
    }

    if (!customSuggests) {
      customSuggests = [];
    }

    var suggests = [],
        regex = new RegExp(this.state.userInput, 'gim'),
        skipSuggest = this.props.skipSuggest;

    this.props.fixtures.forEach(function (suggest) {
      if (!skipSuggest(suggest) && suggest.label.match(regex)) {
        suggest.placeId = suggest.label;
        suggests.push(suggest);
      }
    });

    customSuggests.forEach(function (suggest) {
      suggests.push({
        label: suggest.key,
        type: 'custom',
        location: suggest.data,
        placeId: suggest.key
      });
    });

    suggestsGoogle.forEach(function (suggest) {
      if (!skipSuggest(suggest)) {
        suggests.push({
          label: _this.props.getSuggestLabel(suggest),
          type: 'google',
          placeId: suggest.place_id
        });
      }
    });

    this.setState({ suggests: suggests });
  },

  /**
   * When the input gets focused
   */
  showSuggests: function showSuggests() {
    this.searchSuggests();
    this.setState({ isSuggestsHidden: false });
  },

  /**
   * When the input loses focused
   */
  hideSuggests: function hideSuggests() {
    this.props.onBlur();
    setTimeout((function () {
      this.setState({ isSuggestsHidden: true });
    }).bind(this), 100);
  },

  /**
   * When a key gets pressed in the input
   * @param  {Event} event The keypress event
   */
  onInputKeyDown: function onInputKeyDown(event) {
    switch (event.which) {
      case 40:
        // DOWN
        event.preventDefault();
        this.activateSuggest('next');
        break;
      case 38:
        // UP
        event.preventDefault();
        this.activateSuggest('prev');
        break;
      case 13:
        // ENTER
        event.preventDefault();
        this.selectSuggest(this.state.activeSuggest);
        break;
      case 9:
        // TAB
        this.selectSuggest(this.state.activeSuggest);
        break;
      case 27:
        // ESC
        this.hideSuggests();
        break;
      default:
        break;
    }
  },

  /**
   * Activate a new suggest
   * @param {String} direction The direction in which to activate new suggest
   */
  activateSuggest: function activateSuggest(direction) {
    if (this.state.isSuggestsHidden) {
      this.showSuggests();
      return;
    }

    var suggestsCount = this.state.suggests.length - 1,
        next = direction === 'next',
        newActiveSuggest = null,
        newIndex = 0,
        i = 0; // eslint-disable-line id-length

    for (i; i <= suggestsCount; i++) {
      if (this.state.suggests[i] === this.state.activeSuggest) {
        newIndex = next ? i + 1 : i - 1;
      }
    }

    if (!this.state.activeSuggest) {
      newIndex = next ? 0 : suggestsCount;
    }

    if (newIndex >= 0 && newIndex <= suggestsCount) {
      newActiveSuggest = this.state.suggests[newIndex];
    }

    this.setState({ activeSuggest: newActiveSuggest });
  },

  /**
   * When an item got selected
   * @param {GeosuggestItem} suggest The selected suggest item
   */
  selectSuggest: function selectSuggest(suggest) {
    var isSuggestValid = false;
    if (suggest) {
      this.state.suggests.map((function(sugg) {
        if (sugg.label.indexOf(suggest.label) > -1) isSuggestValid = true;
      }).bind(this));
    }

    if ((!suggest && this.state.suggests.length) || (!isSuggestValid && this.state.suggests.length)) {
      suggest = this.state.suggests[0];
      this.setState({ activeSuggest: null });
    }
    else if (!suggest) {
      suggest = {
        label: this.state.userInput
      };
    }

    this.setState({
      isSuggestsHidden: true,
      userInput: suggest.label
    });

    if (suggest.location) {
      this.props.onSuggestSelect(suggest);
      return;
    }

    if (suggest.type === 'google') {
      this.geocodeSuggest(suggest);
    } else {
      this.props.onSuggestSelect(suggest);
    }
    
  },

  /**
   * Geocode a suggest
   * @param  {Object} suggest The suggest
   */
  geocodeSuggest: function geocodeSuggest(suggest) {
    this.state.geocoder.geocode({ address: suggest.label }, (function (results, status) {
      if (status !== this.props.googleMaps.GeocoderStatus.OK) {
        return;
      }

      var gmaps = results[0],
          location = gmaps.geometry.location;

      suggest.type = 'google';
      suggest.gmaps = gmaps;
      suggest.location = {
        lat: location.lat(),
        lng: location.lng()
      };

      this.props.onSuggestSelect(suggest);
    }).bind(this));
  },

  /**
   * Render the view
   * @return {Function} The React element to render
   */
  render: function render() {
    return (// eslint-disable-line no-extra-parens
      _react2['default'].createElement(
        'div',
        { className: 'geosuggest ' + this.props.className,
          onClick: this.onClick },
        _react2['default'].createElement('input', {
          className: 'geosuggest__input',
          ref: 'geosuggestInput',
          type: 'text',
          value: this.state.userInput,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled,
          onKeyDown: this.onInputKeyDown,
          onChange: this.onInputChange,
          onFocus: this.onFocus,
          onBlur: this.hideSuggests }),
        _react2['default'].createElement(
          'ul',
          { className: this.getSuggestsClasses() },
          this.getSuggestItems(),
          this.poweredByGoogle()
        )
      )
    );
  },

  poweredByGoogle: function poweredByGoogle() {
    var google = _temporalUndefined;
    google = _react2['default'].createElement('div', { className: 'poweredByGoogle' });
    return _react2['default'].createElement(_GeosuggestItem2['default'], {
      key: 'google-logo',
      suggest: { label: _temporalAssertDefined(google, 'google', _temporalUndefined) && google },
      isActive: false,
      onSuggestSelect: function () {} });
  },

  /**
   * Get the suggest items for the list
   * @return {Array} The suggestions
   */
  getSuggestItems: function getSuggestItems() {
    return this.state.suggests.map((function (suggest) {
      var isActive = this.state.activeSuggest && suggest.placeId === this.state.activeSuggest.placeId;

      return (// eslint-disable-line no-extra-parens
        _react2['default'].createElement(_GeosuggestItem2['default'], {
          key: suggest.placeId,
          suggest: suggest,
          isActive: isActive,
          onSuggestSelect: this.selectSuggest })
      );
    }).bind(this));
  },

  /**
   * The classes for the suggests list
   * @return {String} The classes
   */
  getSuggestsClasses: function getSuggestsClasses() {
    var classes = 'geosuggest__suggests';

    classes += this.state.isSuggestsHidden ? ' geosuggest__suggests--hidden' : '';

    return classes;
  }
});
module.exports = _temporalAssertDefined(Geosuggest, 'Geosuggest', _temporalUndefined) && Geosuggest;