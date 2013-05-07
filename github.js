var http = require('http'),
  authQuery = '';

authQuery += '?client_id=' + process.env.GITHUB_CLIENT_ID;
authQuery += '&client_secret=' + process.env.GITHUB_CLIENT_SECRET;
authQuery += '&code=';

exports.authTokenRequest = function(code, callback) {
  var authOptions = {
    host: 'github.com',
    path: '/login/oauth/access_token'
  };

  authOptions.path += code;

  http.post(authOptions, callback);
};
