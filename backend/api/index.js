const app = require('../src/app');

// Vercel serverless function wrapper
module.exports = (req, res) => {
  return app(req, res);
};