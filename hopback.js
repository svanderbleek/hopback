var Redis = require('redis'),
  Url = require('url'),
  Bson = require('buffalo');

redisUrl = Url.parse(process.env.REDISTOGO_URL);
redisClient = Redis.createClient(redisUrl.port, redisUrl.hostname, {
  return_buffers: true
});

redisClient.auth(redisUrl.auth.split(':')[1], popQueue);

/*
function GithubClient() {
  this.transport;
}
GithubClient.prototype.authTokenRequest = function() {};
githubClient = new GithubClient();
*/

function popQueue() {
  redisClient.blpop('queue:github:auth', '0', function(error, responseBuffer) {
    authJob = Bson.parse(responseBuffer);
    console.log(authJob);

    popQueue();
    /*githubClient.authTokenRequest(response.authCode, function(error, githubResponse)
      redisClient.rpush('queue:user', {
        id: queueResponse.id,
        username: githubResponse.username
      });
    });*/
  });
}
