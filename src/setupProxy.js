const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://man-vs-talmo-api.fly.dev',
      changeOrigin: true,
    })
  );
};