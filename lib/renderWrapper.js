'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createRenderVisualizer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var RenderVisualizer = {
  UPDATE_RENDER_LOG_POSITION_INTERVAL_MS: 500,
  MAX_LOG_LENGTH: 20,

  STATE_CHANGES: {
    MOUNT: 'mount',
    UPDATE: 'update'
  },

  styling: {
    renderLog: {
      color: 'rgb(85, 85, 85)',
      fontFamily: '\'Helvetica Neue\', Arial, Helvetica, sans-serif',
      fontSize: '14px',
      lineHeight: '18px',
      background: 'linear-gradient(#fff, #ccc)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
      textShadow: '0 1px 0 #fff',
      borderRadius: '3px',
      position: 'absolute',
      top: 0,
      left: 0,
      maxWidth: '70%',
      padding: '5px 10px',
      zIndex: '10000',
      transition: '.3s all'
    },
    renderLogDetailNotes: {
      color: 'red',
      textAlign: 'center'
    },
    elementHighlightMonitor: {
      outline: '1px solid rgba(47, 150, 180, 1)'
    },
    elementHighlightMount: {
      outline: '3px solid rgba(197, 16, 12, 1)'
    },
    elementHighlightUpdate: {
      outline: '3px solid rgba(197, 203, 1, 1)'
    }
  }
};

var renders = undefined;
if (window.__reactRenders) {
  renders = window.__reactRenders;
} else {
  renders = new Map();
  Object.defineProperty(window, '__reactRenders', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: renders
  });
  window.__reactRendersCount = 0;
}

var containingElement = document.createElement('div');
document.body.appendChild(containingElement);

var addToRenderLog = function addToRenderLog(inst, message) {
  // don't add anything to the log if the element doesn't exist any more
  if (!renders.get(inst)) {
    return;
  }

  var _renders$get = renders.get(inst);

  var log = _renders$get.log;
  var count = _renders$get.count;

  var others = _objectWithoutProperties(_renders$get, ['log', 'count']);

  // add the log message to the start
  log = [count + ' ) ' + message].concat(_toConsumableArray(log));

  // keep everything trimmed to the max log length
  log.splice(RenderVisualizer.MAX_LOG_LENGTH, 1);

  count++;

  renders.set(inst, _extends({}, others, {
    log: log,
    count: count
  }));
};

/*
 * Get the changes made to props or state.
 *
 * @param object prevProps
 * @param object prevState
 * @param object nextProps
 * @param object nextState
 * @return boolean
 */
function getReasonForReRender(prevProps, prevState, nextProps, nextState) {
  for (var key in nextState) {
    if (nextState.hasOwnProperty(key) && nextState[key] !== prevState[key]) {
      if (typeof nextState[key] === 'object') {
        return 'this.state[' + key + '] changed';
      } else {
        return 'this.state[' + key + '] changed: \'' + prevState[key] + '\' => \'' + nextState[key] + '\'';
      }
    }
  }

  for (var key in nextProps) {
    if (nextProps.hasOwnProperty(key) && nextProps[key] !== prevProps[key]) {
      if (typeof nextProps[key] === 'object') {
        return 'this.props[' + key + '] changed';
      } else {
        return 'this.props[' + key + '] changed: \'' + prevProps[key] + '\' => \'' + nextProps[key] + '\'';
      }
    }
  }

  return 'unknown reason for update, possibly from forceUpdate()';
}

var RenderLog = (function (_Component) {
  _inherits(RenderLog, _Component);

  function RenderLog() {
    _classCallCheck(this, RenderLog);

    _get(Object.getPrototypeOf(RenderLog.prototype), 'constructor', this).apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
    this.state = {
      showDetails: false
    };
  }

  _createClass(RenderLog, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.highlightChange(RenderVisualizer.STATE_CHANGES.MOUNT);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // only trigger a highlight if the change happened to the render count, as
      // this will also be triggered if the details are toggled
      if (prevProps.count !== this.props.count) {
        this.highlightChange(RenderVisualizer.STATE_CHANGES.UPDATE);
      }
    }

    /*
     * Highlight any change by adding an animation style to the component DOM node
     * @param String change - The type of change being made to the node
     * @return void
     */
  }, {
    key: 'highlightChange',
    value: function highlightChange(change) {
      var parentNode = _reactDom2['default'].findDOMNode(this.props.node);
      var ANIMATION_DURATION = 500;

      if (parentNode) {
        parentNode.style.boxSizing = 'border-box';

        window.requestAnimationFrame(function () {
          parentNode.animate([change === RenderVisualizer.STATE_CHANGES.MOUNT ? RenderVisualizer.styling.elementHighlightMount : RenderVisualizer.styling.elementHighlightUpdate, RenderVisualizer.styling.elementHighlightMonitor], {
            duration: ANIMATION_DURATION
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _react2['default'].createElement(
        'div',
        { style: _extends({}, RenderVisualizer.styling.renderLog, {

            // go to the top of everything if we're showing details
            zIndex: this.state.showDetails ? 10001 : 10000,

            // round coordinates down to prevent blurring
            transform: 'translate3d(' + (this.props.posLeft | 0) + 'px, ' + (this.props.posTop | 0) + 'px, 0)'
          }), onClick: function () {
            _this.setState({
              showDetails: !_this.state.showDetails
            });
          } },
        _react2['default'].createElement(
          'div',
          { style: { display: this.state.showDetails ? 'none' : 'block' } },
          this.props.count
        ),
        _react2['default'].createElement(
          'div',
          { style: { display: this.state.showDetails ? 'block' : 'none' } },
          _react2['default'].createElement(
            'div',
            null,
            this.props.log.map(function (message, i) {
              return _react2['default'].createElement(
                'div',
                { key: i },
                message
              );
            })
          ),
          _react2['default'].createElement('div', { style: RenderVisualizer.styling.renderLogDetailNode })
        )
      );
    }
  }], [{
    key: 'displayName',
    value: 'RenderLog',
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      log: [],
      count: 1,
      node: null
    },
    enumerable: true
  }]);

  return RenderLog;
})(_react.Component);

var RenderLogs = (function (_Component2) {
  _inherits(RenderLogs, _Component2);

  function RenderLogs() {
    _classCallCheck(this, RenderLogs);

    _get(Object.getPrototypeOf(RenderLogs.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RenderLogs, [{
    key: 'render',
    value: function render() {
      var renderLogs = [];
      this.props.renders.forEach(function (val, key) {
        renderLogs.push(_react2['default'].createElement(RenderLog, _extends({ key: val.id }, val, { node: key })));
      });
      return _react2['default'].createElement(
        'div',
        null,
        renderLogs
      );
    }
  }], [{
    key: 'displayName',
    value: 'RenderLogs',
    enumerable: true
  }]);

  return RenderLogs;
})(_react.Component);

window.setInterval(function () {
  renders.forEach(function (val, node) {
    var parentNode = _reactDom2['default'].findDOMNode(node);
    var parentNodeRect = parentNode && parentNode.getBoundingClientRect();

    if (parentNodeRect) {
      renders.set(node, _extends({}, val, {
        posTop: window.pageYOffset + parentNodeRect.top,
        posLeft: parentNodeRect.left
      }));
    }
  });
  _reactDom2['default'].render(_react2['default'].createElement(RenderLogs, { renders: renders }), containingElement);
}, RenderVisualizer.UPDATE_RENDER_LOG_POSITION_INTERVAL_MS);

_reactDom2['default'].render(_react2['default'].createElement(RenderLogs, { renders: renders }), containingElement);

function createRenderVisualizer() {
  var shouldInstrumentComponent = arguments.length <= 0 || arguments[0] === undefined ? function () {
    return true;
  } : arguments[0];

  return function renderVisualizer() {
    return function wrapRenderVisualizer(ReactClass, componentId) {

      if (!shouldInstrumentComponent(ReactClass)) {
        return ReactClass;
      }

      var old = {
        componentDidMount: ReactClass.prototype.componentDidMount,
        componentDidUpdate: ReactClass.prototype.componentDidUpdate,
        componentWillUnmount: ReactClass.prototype.componentWillUnmount
      };

      ReactClass.prototype.componentDidMount = function () {
        renders.set(this, {
          id: window.__reactRendersCount++,
          log: [],
          count: 0,

          posTop: 0,
          posLeft: 0
        });
        addToRenderLog(this, 'Initial Render');

        if (old.componentDidMount) {
          return old.componentDidMount.apply(this, [].concat(_slice.call(arguments)));
        }
      };
      ReactClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        addToRenderLog(this, getReasonForReRender(prevProps, prevState, this.props, this.state));

        if (old.componentDidUpdate) {
          return old.componentDidUpdate.apply(this, [].concat(_slice.call(arguments)));
        }
      };
      ReactClass.prototype.componentWillUnmount = function () {
        renders['delete'](this);

        if (old.componentWillUnmount) {
          return old.componentWillUnmount.apply(this, [].concat(_slice.call(arguments)));
        }
      };

      return ReactClass;
    };
  };
}

module.exports = exports['default'];