function run(client) {
  const EventEmitter = require('events');
  let authEvents = new EventEmitter();
  client.on('error', function (error, event, topic) {
    console.log({
      event,
      error,
      topic
    });
  });

  client.on('connectionStateChanged', function (state) {
    console.log("deepstream state changed to", state);
    if (state == "AWAITING_AUTHENTICATION") {
      authEvents.emit('awaiting_auth', state);
    } else if (state == "OPEN") {
      authEvents.emit('logged', state);
    }
  });
  authEvents.on('awaiting_auth', function(deepstreamState) {
    console.log('Received when deepstream\'s state was:', deepstreamState);
    client.login({username: 'paul'}, function() {
      console.log('Connected');
    });
  });
  
  authEvents.on('logged', function(deepstreamState) {
    console.log('Congrats, you have been successfully logged in');
  });
}

const serverUrl = process.argv[2] || "localhost:6020";
const deepstream = require('deepstream.io-client-js');
const client = deepstream(serverUrl);

run(client);