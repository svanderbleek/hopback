var https = require('https'),
  querystring = require('querystring'),
  authQuery = '',
  authPath,
  authOptions;

authQuery = querystring.stringify({
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  code: ''
});

authPath = '/login/oauth/access_token?'

authOptions = {
  host: 'github.com'
};

exports.authTokenRequest = function(code, callback) {
  authOptions.path = authPath + authQuery + code;

  console.log(authOptions);

  https.get(authOptions, function(response) {
    var data = '';

    response.on('data', function(chunk) {
      data += chunk;
    });

    response.on('end', function() {
      console.log(data);

      callback(data);
    });
  });
};
