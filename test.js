var Hopback = require('./hopback'),
  authQueue = 'queue:hopback:auth',
  userQueue = 'queue:tun:user',
  authJob = {user: {id: 1}, code: "code"},
  assert = require('assert');

Hopback.redis.flushdb();
Hopback.redis.lpush(authQueue, JSON.stringify(authJob));

Hopback.work();

Hopback.postProcess(function() {
  Hopback.redis.lindex(userQueue, 0, function(err, res) {
    var out = JSON.parse(res);
    assert.equal(authJob.user.id, out.user.id);
    process.exit();
  });
});

process.on('exit', function() {
  console.log('pass');
});
