let arg = process.argv[2];
let get = require('../src/source/getResources');
let set = require('../src/source/setResources');
let empty = require('../src/source/emptyResources');
switch(arg){
    case '-get':
        get();
        break ;
    case '-set':
        set();
        break ;
    case '-empty':
        empty();
        break ;
    default :
        console.log(arg,'命令不存在');
}