var Redis = require('redis'),
  Url = require('url'),
  postProcess = [];

redisUrl = Url.parse(process.env.REDISTOGO_URL);
redisClient = Redis.createClient(redisUrl.port, redisUrl.hostname, {
  no_ready_check: true
});

/*
function GithubClient() {
  this.transport;
}
GithubClient.prototype.authTokenRequest = function() {};
githubClient = new GithubClient();
*/

function popQueue() {
  console.log('waiting');

  redisClient.blpop('queue:github:auth', '0', function(error, queueResponse) {
    console.log('working');

    authJob = JSON.parse(queueResponse[1]);

    console.log(authJob);

    redisClient.rpush('queue:tun:user', JSON.stringify(authJob));

    postProcess.forEach(function(callback) {
      callback.call();
    });

    popQueue();
    /*githubClient.authTokenRequest(response.authCode, function(error, githubResponse)
      redisClient.rpush('queue:user', {
        id: queueResponse.id,
        username: githubResponse.username
      });
    });*/
  });
}

exports.redis = redisClient;
exports.work = function() {
  redisClient.auth(redisUrl.auth.split(':')[1], popQueue);
};
exports.postProcess = function(callback) {
  postProcess.push(callback);
};
