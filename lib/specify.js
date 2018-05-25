'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _renderWrapper = require('./renderWrapper');

var _renderWrapper2 = _interopRequireDefault(_renderWrapper);

exports['default'] = (0, _renderWrapper2['default'])(function (ReactClass) {
  return !!ReactClass.rerenderViz;
});
module.exports = exports['default'];