var Redis = require('redis'),
  Url = require('url'),
  Github = require('./github'),
  postProcess = [];

redisUrl = Url.parse(process.env.REDISTOGO_URL);

redisClient = Redis.createClient(redisUrl.port, redisUrl.hostname, {
  no_ready_check: true
});

function workQueue() {
  console.log('waiting');

  redisClient.blpop('queue:hopback:auth', '0', function(error, queueResponse) {
    var authJob, authCode;

    console.log('working');

    authJob = JSON.parse(queueResponse[1]);

    console.log(authJob);

    user = authJob.user;
    authCode = authJob.code;

    Github.authTokenRequest(authCode, function(data) {
      var userJob;

      console.log("response");

      if(data.token) {
        userJob = JSON.stringify({ user: user, token: data.token });
      } else {
        userJob = JSON.stringify({ user: user, error: data });
      }

      console.log(userJob);

      redisClient.rpush('queue:tun:user', userJob);

      postProcess.forEach(function(callback) {
        callback.call();
      });

      workQueue();
    });
  });
}

exports.redis = redisClient;

exports.work = function() {
  redisClient.auth(redisUrl.auth.split(':')[1], workQueue);
};

exports.postProcess = function(callback) {
  postProcess.push(callback);
};
