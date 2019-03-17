const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js'
  }, 
  resolve: {
    alias: {
      'svelte/ssr/register': 'svelte/ssr/register.js'
    }
  }
};
