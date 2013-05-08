var Redis = require('redis'),
  Url = require('url'),
  Github = require('./github'),
  Tun = require('./tun'),
  postProcess = [];

redisUrl = Url.parse(process.env.REDISTOGO_URL);

redisClient = Redis.createClient(redisUrl.port, redisUrl.hostname, {
  no_ready_check: true
});

function workQueue() {

  redisClient.blpop('queue:hopback:auth', '0', function(error, queueResponse) {
    var authJob, authCode;

    authJob = JSON.parse(queueResponse[1]);

    userId = authJob.id;
    authCode = authJob.code;

    Github.authTokenRequest(authCode, function(data) {
      var userUpdate,
        authError,
        updateError;

      if(data.token) {
        userUpdate = JSON.stringify({ id: userId, token: data.token });

        Tun.userUpdateRequest(userUpdate, function(error) {
          updateError = JSON.stringify({ id: userId, code: code, error: data });
          redisClient.rpush('queue:error:update', updateError);
        });
      } else {
        authError = JSON.stringify({ id: userId, code: code, error: data });
        redisClient.rpush('queue:error:auth', authError);
      }

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
