'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/react-axios-connect.min');
} else {
  module.exports = require('./dist/react-axios-connect');
}
