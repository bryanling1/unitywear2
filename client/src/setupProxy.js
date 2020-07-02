const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/upload", "/svgtest"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};