var Redis = require('redis'),
  Url = require('url');

redisUrl = Url.parse(process.env.REDISTOGO_URL);
redisClient = Redis.createClient(redisUrl.port, redisUrl.hostname);

redisClient.auth(redisUrl.auth.split(':')[1], watchQueue);

/*
function GithubClient() {
  this.transport;
}
GithubClient.prototype.authTokenRequest = function() {};
githubClient = new GithubClient();
*/

function watchQueue() {
  popQueue(popQueue);
}

function popQueue(forever) {
  redisClient.blpop('queue:github:auth', '0', function(error, queueResponse) {
    console.log(queueResponse);
    /*githubClient.authTokenRequest(response.authCode, function(error, githubResponse)
      redisClient.rpush('queue:user', {
        id: queueResponse.id,
        username: githubResponse.username
      });
    });*/
    forever(popQueue);
  });
}
