var repl = require("repl");
var documentManager = require('./documentManager.js');
console.log(' \n=> You are now on document Manager System terminal, Enter a method to get started\n');
console.log(' => To see the available methods, enter: documentManager')
console.log('\n => Pass a callback to perform any action with the response\n')

var replServer = repl.start({
  prompt: "Enter method here > "
});

replServer.context.documentManager = documentManager;
