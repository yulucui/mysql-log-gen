var resources = require('../../resources');
var mysql = require('mysql');
var mysql_conf = require('../../mysql_conf');

module.exports = function(){
    var conn = mysql.createConnection(mysql_conf);
    conn.connect();

    var getKV = function(resource){
        var keys = [];
        var values = [];
        for(var key in resource){
            var value = resource[key];
            keys.push('`' + key + '`');
            if(value == '' || isNaN(value)){
                values.push('\"' + value + '\"');
            }else{
                values.push(value);
            }
        }
        return {
            k: keys.join(','),
            v: values.join(',')
        }
    }

    resources.forEach(function(resource) {
        var name = resource.SOURCE_NAME;
        var kv = getKV(resource);
        let insert = `INSERT INTO SYS_SOURCE_INFO(${kv.k}) VALUES(${kv.v})`;
        conn.query(insert,function(err,res){
            if(err){
                console.error(err);
                return ;
            }
            console.log(`${name}权限 创建成功`);
        });
        console.log(`${name} SQL: `,insert)
    });
}