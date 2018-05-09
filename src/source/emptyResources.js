var mysql = require('mysql');
var mysql_conf = require('../../mysql_conf');

module.exports = function(){
    var conn = mysql.createConnection(mysql_conf);
    conn.connect();

    conn.query('DELETE FROM SYS_SOURCE_INFO',function(err,res){
        if(err){
            console.error(err);
            return ;
        }
        console.log('资源表已清空');
    });
}