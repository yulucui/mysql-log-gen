var mysql = require('mysql');
var tablesGetter = require('./getTables');
var logCreater = require('./createLog');
var triggerCreater = require('./createTrigger');
var mysql_conf = require('../../mysql_conf');
var dbname = mysql_conf.database;

module.exports = function(){
    var conn = mysql.createConnection(mysql_conf);
    conn.connect();

    tablesGetter(conn,dbname).then(function(tables){
        tables.forEach(function(t) {
            var tablename = t.TABLE_NAME;
            if(tablename.slice(-3) == 'REL') return ;
            logCreater(conn,dbname,tablename).then((res) => {
                if(res)
                    console.log(`${tablename}_LOG 创建成功`);
            }).then(() => {
                return triggerCreater(conn,dbname,tablename);
            }).then(() => {
                console.log(`${tablename}触发器 创建成功`);
            });
        }, this);
    });
}