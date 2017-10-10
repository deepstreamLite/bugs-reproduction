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
  
  client.login({username: 'someone'}, (success, data) => {
      console.log('connected');
  });
  
  authEvents.on('logged', function(deepstreamState) {
    console.log('Congrats, you have been successfully logged in');
  });

  client.on('connectionStateChanged', function (state) {
    console.log("deepstream state changed to", state);
    if (state == "OPEN") {
      authEvents.emit('logged', state);
    }
  });
}

const serverUrl = process.argv[2] || "localhost:6020";
const deepstream = require('deepstream.io-client-js');
const client = deepstream(serverUrl);

run(client);
