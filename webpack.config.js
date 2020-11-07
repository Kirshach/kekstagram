const path = require('path');

module.exports = {
  entry: [
    './js/general.js',
    './js/upload-form-general.js',
    './js/upload-form-photo-edit.js',
    './js/upload-form-validation.js',
    './js/upload-form.js',
    './js/filters.js',
    './js/data.js',
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  }
};
