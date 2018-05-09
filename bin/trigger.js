var arg = process.argv[2];
var trigger = require('../src/trigger/trigger');
var delLog = require('../src/trigger/delLogs');

if(arg == '-del'){
    delLog();
} else {
    trigger();
}
