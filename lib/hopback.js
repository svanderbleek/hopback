var  Redis = require('redis');

redisClient = Redis.createClient(proccess.env.REDISTOGO_URL);

function GithubClient() {
  this.transport;
}
GithubClient.prototype.authTokenRequest = function() {};
githubClient = new GithubClient();

redisClient.blpop('queue:github:auth', function(error, queueResponse) {
  githubClient.authTokenRequest(response.authCode, function(error, githubResponse)
    redisClient.rpush('queue:user', {
      id: queueResponse.id,
      username: githubResponse.username
    });
  });
});
