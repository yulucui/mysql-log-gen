var mysql = require('mysql');
var mysql_conf = require('../../mysql_conf');
module.exports = function(){
    var conn = mysql.createConnection(mysql_conf);
    conn.connect();

    conn.query('select * from SYS_SOURCE_INFO',function(err,res){
        console.log(res);
    });
}